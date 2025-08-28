
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Sparkles, Stars, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatNotifications } from '@/hooks/useChatNotifications';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const LiveChatWidget: React.FC = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { unreadCount, addNotification, clearNotifications, setChatState } = useChatNotifications('live-chat');

  // Simuler des réponses automatiques du bot
  useEffect(() => {
    const interval = setInterval(() => {
      // Simuler une réponse automatique du bot
      if (Math.random() < 0.03) { // 3% de chance chaque seconde
        const botResponses = [
          'Un conseiller va vous répondre rapidement.',
          'Avez-vous d\'autres questions ?',
          'Je suis là pour vous aider !',
          'N\'hésitez pas à me poser vos questions.',
          'Comment puis-je améliorer votre expérience ?'
        ];
        
        const newMessage: Message = {
          id: Date.now().toString(),
          text: botResponses[Math.floor(Math.random() * botResponses.length)],
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, newMessage]);
        addNotification();
      }
    }, 3000);

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
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Réponse automatique du bot après 1 seconde
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Merci pour votre message ! Un de nos conseillers va vous répondre rapidement.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
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
      {/* Bouton flottant ultra moderne avec badge de notification */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          {/* Cercles d'animation de fond */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.1, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 blur-md" />
          </motion.div>
          
          <Button
            onClick={handleToggleOpen}
            className="relative w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl border-2 border-white/20 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-7 w-7 text-white" />
            </motion.div>
          </Button>
          
          {/* Badge de notification premium */}
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2"
            >
              <Badge className="bg-red-500 text-white min-w-[24px] h-6 flex items-center justify-center rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Fenêtre de chat ultra moderne */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96"
            style={{ height: isMinimized ? 'auto' : '500px' }}
          >
            <div className="relative h-full">
              {/* Fond animé */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse rounded-3xl" />
              
              <Card className="relative h-full flex flex-col bg-transparent border-2 border-white/20 shadow-2xl rounded-3xl overflow-hidden">
                {/* En-tête premium */}
                <div className="relative bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-xl p-6 border-b border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-75" />
                        <div className="relative w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg" />
                      </motion.div>
                      <div>
                        <span className="font-bold text-white text-lg">Support Premium Elite</span>
                        <p className="text-white/80 text-sm">Assistant IA avancé</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleMinimize}
                        className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                      >
                        {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleOpen}
                        className="text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Corps du chat - caché si minimisé */}
                {!isMinimized && (
                  <>
                    {/* Zone des messages avec scroll personnalisé */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
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
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-75" />
                                <Avatar className="relative w-10 h-10 border-2 border-white/30">
                                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    <Stars className="h-5 w-5" />
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                            )}
                            
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className={`relative p-4 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
                                msg.sender === 'user'
                                  ? 'bg-gradient-to-br from-blue-500/90 to-purple-600/90 text-white border-blue-400/30 ml-auto shadow-lg'
                                  : 'bg-white/10 text-white border-white/20 shadow-xl'
                              }`}
                            >
                              <div className={`absolute inset-0 rounded-3xl opacity-20 ${
                                msg.sender === 'user' 
                                  ? 'bg-gradient-to-r from-white/20 to-transparent'
                                  : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
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
                      <div ref={messagesEndRef} />
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
                            className="bg-white/10 border-2 border-white/20 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 rounded-2xl text-white placeholder-white/60 font-medium py-3 px-4 backdrop-blur-xl transition-all duration-500"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-300 peer-focus:opacity-100 pointer-events-none" />
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            onClick={handleSendMessage}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl rounded-2xl px-6 py-3 border-2 border-blue-400/30 transition-all duration-500 hover:shadow-3xl backdrop-blur-sm"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
