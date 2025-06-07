
import React, { useState, useRef, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, MessageCircle, Sparkles, Phone, Mail, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Bonjour ! Je suis votre assistant virtuel Riziky. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('commande') || message.includes('livraison')) {
      return "Pour suivre votre commande, connectez-vous à votre compte et rendez-vous dans la section 'Mes commandes'. Vous y trouverez le statut de livraison et le numéro de suivi.";
    }
    
    if (message.includes('retour') || message.includes('échange')) {
      return "Vous disposez de 30 jours pour retourner un article. Les retours sont gratuits ! Connectez-vous à votre compte et cliquez sur 'Retourner cet article' dans vos commandes.";
    }
    
    if (message.includes('paiement') || message.includes('carte')) {
      return "Nous acceptons les cartes bancaires, PayPal, Apple Pay et le paiement en 3x sans frais. Tous les paiements sont sécurisés avec le cryptage SSL.";
    }
    
    if (message.includes('produit') || message.includes('stock')) {
      return "Vous pouvez consulter la disponibilité des produits sur leur page. Si un article vous intéresse mais n'est plus en stock, vous pouvez activer les notifications de réapprovisionnement.";
    }
    
    if (message.includes('bonjour') || message.includes('salut')) {
      return "Bonjour ! Ravi de vous aider. Vous pouvez me poser des questions sur vos commandes, les livraisons, les retours, ou nos produits.";
    }
    
    if (message.includes('merci')) {
      return "Je vous en prie ! N'hésitez pas si vous avez d'autres questions. Je suis là pour vous aider 24h/7j.";
    }

    return "Je comprends votre question. Pour une assistance plus personnalisée, n'hésitez pas à contacter notre équipe support au 01 23 45 67 89 ou par email à support@riziky.fr.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    "Suivre ma commande",
    "Politique de retour",
    "Modes de paiement",
    "Délais de livraison"
  ];

  const contactOptions = [
    {
      icon: Phone,
      title: "Téléphone",
      value: "01 23 45 67 89",
      description: "Lun-Ven 9h-18h"
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@riziky.fr",
      description: "Réponse sous 2h"
    },
    {
      icon: Clock,
      title: "Horaires",
      value: "24h/7j",
      description: "Chat en ligne"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                  <MessageCircle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Chat Support
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Obtenez une aide instantanée avec notre assistant virtuel disponible 24h/7j
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-6"
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Autres moyens de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactOptions.map((option, index) => {
                    const IconComponent = option.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{option.title}</h4>
                          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{option.value}</p>
                          <p className="text-xs text-neutral-500">{option.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Actions rapides</h3>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs hover:bg-white transition-colors"
                        onClick={() => setInputMessage(action)}
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm h-[600px] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-white/20 text-white">
                        <Bot className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">Assistant Riziky</CardTitle>
                      <p className="text-sm text-blue-100">En ligne • Répond instantanément</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender === 'bot' && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-1' : ''}`}>
                          <div className={`p-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                          }`}>
                            <p className="text-sm leading-relaxed">{message.text}</p>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 px-2">
                            {message.timestamp.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>

                        {message.sender === 'user' && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-r from-neutral-400 to-neutral-500 text-white">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Input */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="flex-1 h-12 bg-white/50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
