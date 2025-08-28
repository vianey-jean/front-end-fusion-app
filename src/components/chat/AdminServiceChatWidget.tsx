
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minimize2, Maximize2, Phone, Video, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatNotifications } from '@/hooks/useChatNotifications';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  senderName?: string;
}

interface AdminServiceChatWidgetProps {
  userId?: string;
  userName?: string;
}

const AdminServiceChatWidget: React.FC<AdminServiceChatWidgetProps> = ({ 
  userId = 'admin', 
  userName = 'Support Admin' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { unreadCount, addNotification, clearNotifications, setChatState } = useChatNotifications('admin-chat');

  // Simuler la réception de nouveaux messages
  useEffect(() => {
    const interval = setInterval(() => {
      // Simuler un nouveau message aléatoire
      if (Math.random() < 0.1) { // 10% de chance chaque seconde
        const newMessage: Message = {
          id: Date.now().toString(),
          text: 'Nouveau message de test du client',
          sender: 'user',
          timestamp: new Date(),
          senderName: 'Client Test'
        };
        
        setMessages(prev => [...prev, newMessage]);
        addNotification();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Mettre à jour l'état du chat
  useEffect(() => {
    setChatState(isMinimized, !isOpen);
  }, [isMinimized, isOpen, setChatState]);

  // Réinitialiser les notifications quand le chat est ouvert et non minimisé
  useEffect(() => {
    if (isOpen && !isMinimized) {
      clearNotifications();
    }
  }, [isOpen, isMinimized, clearNotifications]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'admin',
      timestamp: new Date(),
      senderName: userName
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Bouton flottant avec badge de notification */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <Button
            onClick={handleToggleOpen}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl border-2 border-white/20"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </Button>
          
          {/* Badge de notification */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2"
            >
              <Badge className="bg-red-500 text-white min-w-[24px] h-6 flex items-center justify-center rounded-full text-xs font-bold animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96"
            style={{ height: isMinimized ? 'auto' : '500px' }}
          >
            <Card className="h-full flex flex-col bg-white/95 backdrop-blur-xl border-2 border-white/20 shadow-2xl rounded-2xl overflow-hidden">
              {/* En-tête */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-white/20 text-white text-sm">
                        AS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-semibold">Admin Support</span>
                      <p className="text-white/80 text-xs">Service client</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleMinimize}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleOpen}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Corps du chat - caché si minimisé */}
              {!isMinimized && (
                <>
                  {/* Zone des messages */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.sender === 'admin'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Zone de saisie */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tapez votre message..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} className="bg-blue-500 hover:bg-blue-600">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
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

export default AdminServiceChatWidget;
