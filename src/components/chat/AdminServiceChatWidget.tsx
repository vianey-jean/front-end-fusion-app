import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Users, Minus, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useChatNotifications } from '@/hooks/useChatNotifications';

interface Client {
  id: string;
  name: string;
  lastMessage: string;
  unreadMessages: number;
}

const AdminServiceChatWidget: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ id: string; text: string; sender: 'admin' | 'client' }[]>([
    { id: '1', text: 'Bonjour ! Comment puis-je vous aider ?', sender: 'admin' }
  ]);
  const [clients, setClients] = useState<Client[]>([
    { id: 'client1', name: 'Jean Dupont', lastMessage: 'Bonjour !', unreadMessages: 2 },
    { id: 'client2', name: 'Alice Martin', lastMessage: 'Merci !', unreadMessages: 0 }
  ]);

  const { unreadCount, resetNotifications } = useChatNotifications({
    isOpen: isOpen && !isMinimized,
    isMinimized,
    chatType: 'admin',
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
    if (!message.trim() || !selectedClientId) return;

    const newMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'admin' as const
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simuler une réponse du client
    setTimeout(() => {
      const clientResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Merci pour votre aide !',
        sender: 'client' as const
      };
      setMessages(prev => [...prev, clientResponse]);
    }, 1000);
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  return (
    <>
      {/* Bouton flottant avec badge de notification */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <Button
            onClick={handleToggleChat}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl border-2 border-white/20"
          >
            <MessageSquare className="h-6 w-6 text-white" />
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
            className={`fixed bottom-24 left-6 z-50 ${
              isMinimized ? 'w-48 h-12' : 'w-96 h-[600px]'
            } transition-all duration-300`}
          >
            <Card className="h-full flex flex-col bg-white shadow-2xl border-2 border-blue-200 rounded-2xl overflow-hidden">
              {/* En-tête avec contrôles */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5" />
                  <div>
                    <span className="font-semibold">Service Client</span>
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
                  {/* Liste des clients */}
                  <div className="flex-1 flex">
                    <div className="w-32 border-r border-blue-200 p-2">
                      <h3 className="text-sm font-semibold mb-2">Clients</h3>
                      {clients.map(client => (
                        <div
                          key={client.id}
                          className={`p-2 rounded-md hover:bg-blue-50 cursor-pointer ${selectedClientId === client.id ? 'bg-blue-100' : ''}`}
                          onClick={() => handleSelectClient(client.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs">{client.name}</span>
                            {client.unreadMessages > 0 && (
                              <span className="bg-red-500 text-white text-xxs px-1 rounded-full">
                                {client.unreadMessages}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Zone de chat */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex-1 overflow-y-auto space-y-2">
                        {messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`p-2 rounded-md ${msg.sender === 'admin' ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`}
                            style={{ maxWidth: '80%' }}
                          >
                            <span className="text-sm">{msg.text}</span>
                          </div>
                        ))}
                      </div>

                      {/* Input de message */}
                      <div className="mt-4">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Écrivez votre message..."
                            className="flex-1 border border-blue-200 rounded-md p-2 text-sm"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                          />
                          <Button onClick={handleSendMessage} className="bg-blue-600 text-white rounded-md px-4 text-sm">
                            Envoyer
                          </Button>
                        </div>
                      </div>
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
