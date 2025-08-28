
import { useState, useEffect, useCallback } from 'react';
import { playNotificationSound } from '@/utils/audio-utils';

interface ChatNotification {
  unreadCount: number;
  lastMessageId?: string;
}

interface UseChatNotificationsProps {
  isOpen: boolean;
  isMinimized: boolean;
  chatType: 'admin' | 'client' | 'live';
  userId?: string;
}

export const useChatNotifications = ({ isOpen, isMinimized, chatType, userId }: UseChatNotificationsProps) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastCheckedTime, setLastCheckedTime] = useState(new Date().toISOString());

  const checkForNewMessages = useCallback(async () => {
    try {
      let endpoint = '';
      
      switch (chatType) {
        case 'admin':
          endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/admin-chat/unread-count?since=${lastCheckedTime}`;
          break;
        case 'client':
          endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/client-chat/unread-count?since=${lastCheckedTime}`;
          break;
        case 'live':
          endpoint = `${import.meta.env.VITE_API_BASE_URL}/api/live-chat/unread-count?since=${lastCheckedTime}`;
          break;
      }

      if (userId) {
        endpoint += `&userId=${userId}`;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        
        if (data.newMessages > 0 && (isMinimized || !isOpen)) {
          const newUnreadCount = unreadCount + data.newMessages;
          setUnreadCount(newUnreadCount);
          
          // Jouer un bip pour chaque nouveau message
          for (let i = 0; i < data.newMessages; i++) {
            setTimeout(() => {
              playNotificationSound('/notification-bip.mp3');
            }, i * 300); // Délai entre chaque bip
          }
          
          setLastCheckedTime(new Date().toISOString());
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des nouveaux messages:', error);
    }
  }, [chatType, userId, lastCheckedTime, unreadCount, isMinimized, isOpen]);

  // Vérifier les nouveaux messages toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(checkForNewMessages, 2000);
    return () => clearInterval(interval);
  }, [checkForNewMessages]);

  // Réinitialiser le compteur quand le chat est ouvert et pas minimisé
  useEffect(() => {
    if (isOpen && !isMinimized && unreadCount > 0) {
      setUnreadCount(0);
      setLastCheckedTime(new Date().toISOString());
    }
  }, [isOpen, isMinimized, unreadCount]);

  const resetNotifications = useCallback(() => {
    setUnreadCount(0);
    setLastCheckedTime(new Date().toISOString());
  }, []);

  return {
    unreadCount,
    resetNotifications
  };
};
