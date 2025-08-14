
import { useState, useEffect, useCallback } from 'react';
import { messageService, Message } from '@/services/messageService';
import { realtimeService } from '@/services/realtimeService';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const [messagesData, count] = await Promise.all([
        messageService.getAllMessages(),
        messageService.getUnreadCount()
      ]);
      setMessages(messagesData);
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (messageData: Omit<Message, 'id' | 'dateEnvoi' | 'isRead'>) => {
    try {
      const newMessage = await messageService.sendMessage(messageData);
      setMessages(prev => [newMessage, ...prev]);
      setUnreadCount(prev => prev + 1);
      return newMessage;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  }, []);

  const markAsRead = useCallback(async (messageId: string) => {
    try {
      await messageService.markAsRead(messageId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }, []);

  const markAsUnread = useCallback(async (messageId: string) => {
    try {
      await messageService.markAsUnread(messageId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: false } : msg
      ));
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Erreur lors du marquage comme non lu:', error);
      throw error;
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await messageService.deleteMessage(messageId);
      const messageToDelete = messages.find(msg => msg.id === messageId);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      
      if (messageToDelete && !messageToDelete.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      throw error;
    }
  }, [messages]);

  // Synchronisation temps réel
  useEffect(() => {
    loadMessages();

    const unsubscribe = realtimeService.addDataListener((data) => {
      if (data.messages) {
        setMessages(data.messages);
        const count = data.messages.filter((msg: Message) => !msg.isRead).length;
        setUnreadCount(count);
      }
    });

    return unsubscribe;
  }, [loadMessages]);

  return {
    messages,
    unreadCount,
    isLoading,
    sendMessage,
    markAsRead,
    markAsUnread,
    deleteMessage,
    loadMessages
  };
};
