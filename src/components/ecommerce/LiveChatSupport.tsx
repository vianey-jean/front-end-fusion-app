import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/components/ui/sonner';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Video, 
  Paperclip, 
  Smile, 
  X,
  Minimize2,
  Maximize2,
  Users,
  Clock,
  CheckCircle,
  Bot,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'agent' | 'bot';
  message: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status?: 'sent' | 'delivered' | 'read';
}

interface Agent {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
  speciality: string;
}

interface LiveChatSupportProps {
  isOpen: boolean;
  onToggle: () => void;
  agentInfo?: Agent;
}

const LiveChatSupport: React.FC<LiveChatSupportProps> = ({
  isOpen,
  onToggle,
  agentInfo
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      message: 'Bonjour ! Je suis là pour vous aider. Un de nos conseillers va prendre en charge votre demande.',
      timestamp: new Date(),
      type: 'text',
      status: 'read'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [agent, setAgent] = useState<Agent | null>(agentInfo || null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate agent assignment
    setTimeout(() => {
      setAgent({
        id: '1',
        name: 'Sarah Martin',
        avatar: '/avatars/agent-1.jpg',
        status: 'online',
        speciality: 'Support technique'
      });
      setConnectionStatus('connected');
      
      // Agent welcome message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'agent',
        message: 'Bonjour ! Je suis Sarah, votre conseillère. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date(),
        type: 'text',
        status: 'read'
      }]);
    }, 2000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      message: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate agent response
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        message: `Je comprends votre demande concernant "${newMessage}". Laissez-moi vérifier cela pour vous...`,
        timestamp: new Date(),
        type: 'text',
        status: 'read'
      };
      setMessages(prev => [...prev, agentResponse]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickReplies = [
    'J\'ai un problème avec ma commande',
    'Question sur un produit',
    'Problème de livraison',
    'Demande de remboursement'
  ];

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggle}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg relative"
        >
          <MessageCircle className="h-6 w-6" />
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
            3
          </Badge>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-4 right-4 z-50 w-96 h-[32rem] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
    >
      <Card className="h-full flex flex-col shadow-2xl border-0 bg-white">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {agent ? (
                <>
                  <div className="relative">
                    <Avatar className="w-10 h-10 border-2 border-white">
                      <AvatarImage src={agent.avatar} alt={agent.name} />
                      <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(agent.status)}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{agent.name}</h3>
                    <p className="text-xs opacity-90">{agent.speciality}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold text-sm">Support Client</h3>
                    <p className="text-xs opacity-90">En ligne</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-white hover:bg-white/20 p-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' : 
                connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
              }`} />
              <span className="opacity-90">
                {connectionStatus === 'connected' ? 'Connecté' : 
                 connectionStatus === 'connecting' ? 'Connexion...' : 'Déconnecté'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
                <Phone className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
                <Video className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white rounded-br-sm' 
                          : message.sender === 'bot'
                            ? 'bg-gray-200 text-gray-800 rounded-bl-sm'
                            : 'bg-white text-gray-800 rounded-bl-sm border'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}>
                        <span>{formatTime(message.timestamp)}</span>
                        {message.sender === 'user' && message.status && (
                          <CheckCircle className={`h-3 w-3 ${
                            message.status === 'read' ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </div>
                    
                    {message.sender !== 'user' && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        message.sender === 'bot' ? 'order-2' : 'order-1'
                      }`}>
                        {message.sender === 'bot' ? (
                          <Bot className="h-5 w-5 text-blue-600" />
                        ) : agent ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback className="text-xs">
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <User className="h-5 w-5 text-gray-600" />
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white p-3 rounded-lg rounded-bl-sm border">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies */}
              {messages.length === 2 && (
                <div className="p-3 bg-white border-t">
                  <p className="text-xs text-gray-600 mb-2">Réponses rapides :</p>
                  <div className="flex flex-wrap gap-1">
                    {quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setNewMessage(reply)}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700 p-1"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 p-1"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default LiveChatSupport;