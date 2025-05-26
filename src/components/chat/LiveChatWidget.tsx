
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Smile, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI } from '@/services/chatAPI';
import { toast } from '@/components/ui/sonner';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  read: boolean;
  isAdminReply?: boolean;
  isSystemMessage?: boolean;
}

const LiveChatWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Récupérer la conversation avec le service client
  const { data: conversation } = useQuery({
    queryKey: ['serviceChat'],
    queryFn: async () => {
      if (!user) return { messages: [] };
      try {
        const response = await clientChatAPI.getServiceChat();
        return response.data || { messages: [] };
      } catch (error) {
        console.error("Erreur lors du chargement du chat:", error);
        return { messages: [] };
      }
    },
    enabled: !!user,
    refetchInterval: 3000 // Rafraîchir toutes les 3 secondes
  });

  // Compter les messages non lus
  useEffect(() => {
    if (conversation?.messages) {
      const unread = conversation.messages.filter(
        (msg: Message) => !msg.read && msg.senderId !== user?.id
      ).length;
      setUnreadCount(unread);

      // Auto-minimiser si nouveau message non lu
      if (unread > 0 && isOpen && !isMinimized) {
        setIsMinimized(true);
        toast.info("Nouveau message reçu !");
      }
    }
  }, [conversation?.messages, user?.id, isOpen, isMinimized]);

  // Mutation pour envoyer un message
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return clientChatAPI.sendServiceMessage(message);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['serviceChat'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("L'envoi du message a échoué. Veuillez réessayer.");
    }
  });

  // Défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages, isMinimized]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.native);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  if (!user) return null;

  return (
    <>
      {/* Bouton flottant */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={openChat}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        
        {/* Badge de notification */}
        {unreadCount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1"
          >
            {unreadCount}
          </motion.div>
        )}
      </motion.div>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-24 right-6 z-50 w-80 ${
              isMinimized ? 'h-16' : 'h-96'
            } transition-all duration-300`}
          >
            <Card className="h-full flex flex-col shadow-xl">
              {/* En-tête */}
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-medium">Support en ligne</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-blue-700 p-1"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-blue-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages - seulement visible si pas minimisé */}
              {!isMinimized && (
                <>
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {conversation?.messages?.length === 0 ? (
                      <div className="text-center text-gray-500 text-sm">
                        Bonjour ! Comment puis-je vous aider aujourd'hui ?
                      </div>
                    ) : (
                      conversation?.messages?.map((msg: Message) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex items-start space-x-2 max-w-[80%]">
                            {msg.senderId !== user.id && (
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-blue-100">
                                  <Bot className="h-3 w-3 text-blue-600" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`p-3 rounded-lg text-sm ${
                                msg.senderId === user.id
                                  ? 'bg-blue-600 text-white ml-auto'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {msg.content}
                              <div className="text-xs opacity-70 mt-1">
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                            
                            {msg.senderId === user.id && (
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-gray-200">
                                  <User className="h-3 w-3 text-gray-600" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Zone de saisie */}
                  <div className="p-4 border-t">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                      <div className="relative flex-1">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tapez votre message..."
                          className="pr-10"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-0 top-0 h-full"
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
                        type="submit"
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={sendMessageMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
