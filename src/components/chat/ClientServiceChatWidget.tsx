import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minus, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI } from '@/services/chatAPI';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import UserAvatar from '@/components/user/UserAvatar';
import { toast } from 'sonner';
import FileUploadButton from '@/components/chat/FileUploadButton';
import VoiceRecorder from '@/components/chat/VoiceRecorder';
import FilePreview from '@/components/chat/FilePreview';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useChatNotifications } from '@/hooks/useChatNotifications';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
  isSystemMessage?: boolean;
  isAdminReply?: boolean;
  fileAttachment?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
    url: string;
  };
}

const ClientServiceChatWidget: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  const shouldShowWidget =
    isAuthenticated && location.pathname !== '/admin/service-client';

  const { data: conversation, refetch } = useQuery({
    queryKey: ['clientServiceConversation', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        const response = await clientChatAPI.getClientConversation(user.id);
        return response.data;
      } catch (error) {
        console.error(
          'Erreur lors du chargement de la conversation du client:',
          error
        );
        return null;
      }
    },
    enabled: shouldShowWidget,
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (conversation?.id && conversationId !== conversation.id) {
      setConversationId(conversation.id);
    }
  }, [conversation?.id, conversationId]);

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      if (!conversationId) {
        throw new Error('Conversation ID is not defined.');
      }
      return clientChatAPI.sendMessage(conversationId, messageText);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({
        queryKey: ['clientServiceConversation', user?.id],
      });
    },
    onError: (error) => {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async ({ file, messageText }: { file: File; messageText?: string }) => {
      if (!conversationId) {
        throw new Error('Conversation ID is not defined.');
      }
      return clientChatAPI.uploadFile(conversationId, file, messageText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['clientServiceConversation', user?.id],
      });
      toast.success('Fichier envoyé avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'upload du fichier:', error);
      toast.error('Erreur lors de l\'envoi du fichier');
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleFileSelect = (file: File) => {
    uploadFileMutation.mutate({ file });
  };

  const handleVoiceRecording = (audioBlob: Blob) => {
    const audioFile = new File([audioBlob], `client-voice-${Date.now()}.wav`, {
      type: 'audio/wav',
    });
    uploadFileMutation.mutate({ file: audioFile, messageText: 'Message vocal' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (messagesEndRef.current && isOpen && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation, isOpen, isMinimized]);

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  // Calculer le nombre total de messages non lus
  const totalUnreadCount = React.useMemo(() => {
    if (!conversation || !user) return 0;
    
    return conversation.messages?.filter(
      (msg: Message) => !msg.read && msg.senderId !== user.id && !msg.isSystemMessage && msg.isAdminReply
    ).length || 0;
  }, [conversation, user]);

  // Utiliser le hook de notifications
  const { unreadCount, resetNotifications } = useChatNotifications(
    isOpen,
    isMinimized,
    totalUnreadCount
  );

  const handleOpenWidget = () => {
    setIsOpen(true);
    resetNotifications();
  };

  if (!isAuthenticated || !shouldShowWidget) return null;

  return (
    <>
      {/* Bouton flottant */}
      {!isOpen && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            <Button
              onClick={handleOpenWidget}
              className="rounded-full w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <MessageCircle className="h-7 w-7 text-white" />
              </motion.div>
            </Button>

            {/* Badge de notification pour messages non lus */}
            {unreadCount > 0 && (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold"
              >
                {unreadCount}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`fixed bottom-6 right-6 z-50 ${
              isMinimized ? "w-80 h-20" : "w-96 h-[32rem]"
            }`}
          >
            <div className="relative">
              {/* Badge de notification quand minimisé */}
              {isMinimized && unreadCount > 0 && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md font-bold z-10"
                >
                  {unreadCount}
                </motion.div>
              )}

              <Card className="h-full flex flex-col shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border border-white/30">
                {/* En-tête */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-t-2xl shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-3 h-3 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      />
                      <span className="font-semibold text-lg tracking-wide">
                        Service Client
                      </span>
                      {/* Badge de notification dans l'en-tête */}
                      {!isMinimized && unreadCount > 0 && (
                        <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-white hover:bg-white/20 p-1 rounded-full transition-all"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:bg-white/20 p-1 rounded-full transition-all"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white/60 to-gray-100/70 dark:from-gray-900/60 dark:to-gray-800/70">
                  <div className="space-y-4">
                    {conversation?.messages?.map((msg: Message) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex items-start space-x-2 ${
                          msg.senderId === user?.id
                            ? 'flex-row-reverse space-x-reverse'
                            : ''
                        }`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {msg.senderId === user?.id ? (
                            <UserAvatar user={user} size="sm" />
                          ) : (
                            <Avatar className="w-7 h-7 shadow-md">
                              <AvatarFallback className="bg-blue-200">
                                <User className="h-4 w-4 text-blue-600" />
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>

                        {/* Message */}
                        <div className="max-w-[75%]">
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`p-3 rounded-2xl shadow-sm text-sm ${
                              msg.isSystemMessage
                                ? 'bg-gray-200 text-gray-700 italic'
                                : msg.senderId === user?.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-white/80 text-gray-800 border border-gray-200'
                            }`}
                          >
                            {msg.content}
                            <p
                              className={`text-xs mt-1 ${
                                msg.isSystemMessage
                                  ? 'text-gray-500'
                                  : msg.senderId === user?.id
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Zone saisie */}
                <div className="p-4 border-t bg-white/70 dark:bg-gray-900/70">
                  <div className="flex space-x-2">
                    <FileUploadButton
                      onFileSelect={handleFileSelect}
                      accept="*/*"
                      maxSize={50}
                      disabled={uploadFileMutation.isPending}
                    />
                    <VoiceRecorder
                      onRecordingComplete={handleVoiceRecording}
                      disabled={uploadFileMutation.isPending}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Écrire un message..."
                        onKeyPress={(e) =>
                          e.key === 'Enter' && handleSendMessage()
                        }
                        className="pr-10 rounded-xl shadow-sm"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-200/50 rounded-full"
                          >
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" side="top">
                          <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            theme="light"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg rounded-xl"
                      disabled={sendMessageMutation.isPending}
                    >
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientServiceChatWidget;
