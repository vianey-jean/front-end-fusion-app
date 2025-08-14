
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ScrollToTop from '@/components/ScrollToTop';
import { MessageCard } from '@/components/messages/MessageCard';
import { useMessages } from '@/hooks/useMessages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Search, Inbox, MailOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PremiumLoading from '@/components/ui/premium-loading';

const MessagesPage: React.FC = () => {
  const { messages, unreadCount, isLoading, markAsRead, markAsUnread, deleteMessage } = useMessages();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'unread') return matchesSearch && !message.isRead;
    if (activeTab === 'read') return matchesSearch && message.isRead;
    return matchesSearch;
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast({
        title: "Message marqué comme lu",
        description: "Le message a été marqué comme lu avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme lu.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      await markAsUnread(id);
      toast({
        title: "Message marqué comme non lu",
        description: "Le message a été marqué comme non lu avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer le message comme non lu.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMessage(id);
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <PremiumLoading 
          text="Chargement des messages..."
          size="lg"
          overlay={true}
          variant="default"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-slate-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-16">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Mail className="h-4 w-4 mr-2" />
              Centre de Messages
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Messages Reçus
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Gérez tous vos messages de contact en un seul endroit
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats et recherche */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  Total: {messages.length}
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Non lus: {unreadCount}
                </Badge>
                <Badge variant="outline" className="bg-white dark:bg-gray-800">
                  Lus: {messages.length - unreadCount}
                </Badge>
              </div>
              
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher dans les messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-gray-800">
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  Tous
                  <Badge variant="outline" className="ml-1">{messages.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Non lus
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read" className="flex items-center gap-2">
                  <MailOpen className="h-4 w-4" />
                  Lus
                  <Badge variant="outline" className="ml-1">{messages.length - unreadCount}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Aucun message trouvé
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchTerm ? 'Aucun message ne correspond à votre recherche.' : 'Vous n\'avez pas encore reçu de messages.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((message) => (
                      <MessageCard
                        key={message.id}
                        message={message}
                        onMarkAsRead={handleMarkAsRead}
                        onMarkAsUnread={handleMarkAsUnread}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;
