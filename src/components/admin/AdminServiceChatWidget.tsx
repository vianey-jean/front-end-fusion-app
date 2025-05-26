
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Smile, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientChatAPI } from '@/services/chatAPI';
import { toast } from '@/components/ui/sonner';
import { useLocation } from 'react-router-dom';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ServiceConversation {
  id: string;
  clientInfo: {
    id: string;
    nom: string;
    email: string;
  };
  messages: Array<{
    id: string;
    content: string;
    senderId: string;
    timestamp: string;
    read: boolean;
    isAdminReply?: boolean;
  }>;
  unreadCount: number;
}

const AdminServiceChatWidget: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // Ne pas afficher le widget si on est sur la page de chat admin ou si ce n'est pas le bon utilisateur
  const isOnChatPage = location.pathname.includes('/admin/chat');
  const isServiceClientAdmin = user?.email === 'service.client@example.com';

  // Récupérer les conversations de service
  const { data: conversations = [] } = useQuery({
    queryKey: ['serviceConversations'],
    queryFn: async () => {
      try {
        const response = await clientChatAPI.getServiceConversations();
        return response.data || [];
      } catch (error) {
        console.error("Erreur lors du chargement des conversations:", error);
        return [];
      }
    },
    enabled: !!user && isServiceClientAdmin && !isOnChatPage,
    refetchInterval: 3000
  });

  // Compter les messages non lus total
  useEffect(() => {
    const totalUnread = conversations.reduce((total: number, conv: ServiceConversation) => 
      total + (conv.unreadCount || 0), 0
    );
    setTotalUnreadCount(totalUnread);

    // Auto-ouvrir si nouveau message non lu
    if (totalUnread > 0 && !isOpen) {
      setIsOpen(true);
      setIsMinimized(true);
      toast.info("Nouveau message client reçu !");
    }
  }, [conversations, isOpen]);

  // Mutation pour envoyer une réponse
  const sendReplyMutation = useMutation({
    mutationFn: async ({ conversationId, message }: { conversationId: string; message: string }) => {
      return clientChatAPI.sendServiceReply(conversationId, message);
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['serviceConversations'] });
    },
    onError: (error) => {
      console.error("Erreur lors de l'envoi de la réponse:", error);
      toast.error("L'envoi de la réponse a échoué.");
    }
  });

  const handleSendReply = () => {
    if (!message.trim() || !selectedConversation) return;
    sendReplyMutation.mutate({ conversationId: selectedConversation, message });
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

  const getSelectedConversationData = () => {
    return conversations.find((conv: ServiceConversation) => conv.id === selectedConversation);
  };

  // Défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    if (messagesEndRef.current && !isMinimized) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [getSelectedConversationData()?.messages, isMinimized]);

  // Ne pas afficher si conditions non remplies
  if (!user || !isServiceClientAdmin || isOnChatPage || conversations.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bouton flottant */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="rounded-full w-14 h-14 bg-red-800 hover:bg-red-700 shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
        
        {/* Badge de notification */}
        {totalUnreadCount > 0 && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1"
          >
            {totalUnreadCount}
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
            className={`fixed bottom-24 left-6 z-50 w-80 ${
              isMinimized ? 'h-16' : 'h-96'
            } transition-all duration-300`}
          >
            <Card className="h-full flex flex-col shadow-xl">
              {/* En-tête */}
              <div className="bg-red-800 text-white p-4 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Messages Clients</span>
                    {totalUnreadCount > 0 && (
                      <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
                        {totalUnreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="text-white hover:bg-red-700 p-1"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="text-white hover:bg-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contenu - seulement visible si pas minimisé */}
              {!isMinimized && (
                <>
                  {/* Sélecteur de conversation */}
                  <div className="p-3 border-b">
                    <Select value={selectedConversation} onValueChange={setSelectedConversation}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner une conversation" />
                      </SelectTrigger>
                      <SelectContent>
                        {conversations.map((conv: ServiceConversation) => (
                          <SelectItem key={conv.id} value={conv.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{conv.clientInfo.nom}</span>
                              {conv.unreadCount > 0 && (
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {selectedConversation ? (
                      getSelectedConversationData()?.messages?.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className="flex items-start space-x-2 max-w-[80%]">
                            {msg.senderId !== user.id && (
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-blue-100">
                                  <User className="h-3 w-3 text-blue-600" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            
                            <div
                              className={`p-3 rounded-lg text-sm ${
                                msg.senderId === user.id
                                  ? 'bg-red-800 text-white ml-auto'
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
                                <AvatarFallback className="bg-red-100">
                                  <User className="h-3 w-3 text-red-800" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </div>
                      )) || []
                    ) : (
                      <div className="text-center text-gray-500 text-sm">
                        Sélectionnez une conversation pour voir les messages
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Zone de saisie */}
                  {selectedConversation && (
                    <div className="p-4 border-t">
                      <form onSubmit={(e) => { e.preventDefault(); handleSendReply(); }} className="flex space-x-2">
                        <div className="relative flex-1">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Répondre au client..."
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
                          className="bg-red-800 hover:bg-red-700"
                          disabled={sendReplyMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminServiceChatWidget;
