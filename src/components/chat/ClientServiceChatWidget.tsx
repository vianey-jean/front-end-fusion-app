import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Minus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useChatNotifications } from '@/hooks/useChatNotifications';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ClientServiceChatWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { unreadCount, resetNotifications } = useChatNotifications({
    isOpen: isOpen && !isMinimized,
    isMinimized,
    chatType: 'client',
    userId: user?.id
  });

  const handleToggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsMinimized(false);
    } else {
      setIsOpen(true);
      setIsMinimized(false);
      if (unreadCount > 0) {
        resetNotifications();
      }
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    if (unreadCount > 0) {
      resetNotifications();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Réponse automatique du bot (simulation)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Merci pour votre message ! Un de nos conseillers va vous répondre rapidement.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      scrollToBottom();
    }, 1000);

    scrollToBottom();
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
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
            onClick={handleToggleChat}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl border-2 border-white/20"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
          
          {/* Badge de notification */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg border-2 border-white"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Interface de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: isMinimized ? 0.3 : 1, 
              y: isMinimized ? 20 : 0 
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className={`fixed bottom-24 right-6 z-50 ${
              isMinimized ? 'w-48 h-12' : 'w-96 h-[500px]'
            } transition-all duration-300`}
          >
            <Card className="h-full flex flex-col bg-white shadow-2xl border-2 border-green-200 rounded-2xl overflow-hidden">
              {/* En-tête avec contrôles */}
              <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5" />
                  <div>
                    <span className="font-semibold">Support Client</span>
                    {isMinimized && unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!isMinimized && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMinimize}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                  {isMinimized && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleMaximize}
                      className="text-white hover:bg-white/20 p-1"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 p-1"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Contenu du chat (masqué si minimisé) */}
              {!isMinimized && (
                <>
                  {/* Zone des messages avec scroll personnalisé */}
                  <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" ref={chatContainerRef}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex items-start space-x-3 max-w-[85%]">
                          {msg.sender === 'bot' && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-full blur opacity-75" />
                              <Avatar className="relative w-10 h-10 border-2 border-white/30">
                                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white">
                                  <Bot className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                          )}
                          
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className={`relative p-4 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
                              msg.sender === 'user'
                                ? 'bg-gradient-to-br from-green-500/90 to-blue-600/90 text-white border-green-400/30 ml-auto shadow-lg'
                                : 'bg-white/10 text-white border-white/20 shadow-xl'
                            }`}
                          >
                            {/* Effet de brillance */}
                            <div className={`absolute inset-0 rounded-3xl opacity-20 ${
                              msg.sender === 'user' 
                                ? 'bg-gradient-to-r from-white/20 to-transparent'
                                : 'bg-gradient-to-r from-green-400/20 to-blue-400/20'
                            }`} />
                            
                            <p className="relative text-sm font-medium leading-relaxed">{msg.text}</p>
                            
                            <div className="relative mt-2 pt-2 border-t border-white/20">
                              <span className="text-xs text-white/70 font-medium">
                                {msg.timestamp.toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </motion.div>
                          
                          {msg.sender === 'user' && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="relative"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-red-600 rounded-full blur opacity-75" />
                              <Avatar className="relative w-10 h-10 border-2 border-white/30">
                                <AvatarFallback className="bg-gradient-to-br from-pink-500 to-red-600 text-white">
                                  <User className="h-5 w-5" />
                                </AvatarFallback>
                              </Avatar>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Zone de saisie premium */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative p-6 border-t border-white/20 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl"
                  >
                    <div className="flex space-x-3">
                      <div className="relative flex-1">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="✨ Écrivez votre message magique..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="bg-white/10 border-2 border-white/20 focus:border-green-400/50 focus:ring-2 focus:ring-green-400/20 rounded-2xl text-white placeholder-white/60 font-medium py-3 px-4 backdrop-blur-xl transition-all duration-500"
                        />
                        {/* Effet de gradient sur le focus */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-blue-500/20 opacity-0 transition-opacity duration-300 peer-focus:opacity-100 pointer-events-none" />
                      </div>
                      
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          onClick={handleSendMessage}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-2xl rounded-2xl px-6 py-3 border-2 border-green-400/30 transition-all duration-500 hover:shadow-3xl backdrop-blur-sm"
                        >
                          <motion.div
                            whileHover={{ rotate: 15 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Send className="h-5 w-5" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    </div>
                    
                    {/* Indicateur de saisie */}
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mt-3 text-center text-xs text-white/50 font-medium"
                    >
                      Tapez Enter pour envoyer • Support 24/7 disponible
                    </motion.div>
                  </motion.div>
                </>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientServiceChatWidget;
