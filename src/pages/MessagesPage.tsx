
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Trash2, 
  Eye, 
  EyeOff,
  Clock,
  User
} from 'lucide-react';
import { useMessages, Message } from '@/hooks/use-messages';
import { useAuth } from '@/contexts/AuthContext';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessagesPage: React.FC = () => {
  const { messages, unreadCount, isLoading, markAsRead, markAsUnread, deleteMessage } = useMessages();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">Accès restreint</h2>
            <p className="text-gray-500 mb-6">
              Vous devez être connecté pour accéder à vos messages.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleMarkAsRead = async (message: Message) => {
    await markAsRead(message.id);
    if (selectedMessage?.id === message.id) {
      setSelectedMessage({ ...message, lu: true });
    }
  };

  const handleMarkAsUnread = async (message: Message) => {
    await markAsUnread(message.id);
    if (selectedMessage?.id === message.id) {
      setSelectedMessage({ ...message, lu: false });
    }
  };

  const handleDelete = async (messageId: string) => {
    await deleteMessage(messageId);
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    toast({
      title: "Message supprimé",
      description: "Le message a été supprimé avec succès.",
    });
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.lu) {
      handleMarkAsRead(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Mes Messages
          </h1>
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="px-3 py-1">
              <MessageSquare className="h-4 w-4 mr-2" />
              {messages.length} message{messages.length > 1 ? 's' : ''}
            </Badge>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="px-3 py-1">
                <Mail className="h-4 w-4 mr-2" />
                {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Liste des messages */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Liste des messages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Chargement des messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucun message reçu</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                          !message.lu 
                            ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
                            : ''
                        } ${
                          selectedMessage?.id === message.id 
                            ? 'bg-purple-50 dark:bg-purple-900/20' 
                            : ''
                        }`}
                        onClick={() => handleMessageClick(message)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className={`font-medium text-sm ${!message.lu ? 'font-bold' : ''}`}>
                              {message.expediteurNom}
                            </span>
                          </div>
                          {!message.lu && (
                            <Badge variant="destructive" className="text-xs px-2 py-0.5">
                              Nouveau
                            </Badge>
                          )}
                        </div>
                        
                        <p className={`text-sm mb-2 ${!message.lu ? 'font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>
                          {message.sujet}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(message.dateEnvoi), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Détail du message sélectionné */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 mb-2">
                        <Mail className="h-5 w-5 text-purple-600" />
                        {selectedMessage.sujet}
                        {!selectedMessage.lu && (
                          <Badge variant="destructive" className="text-xs">
                            Non lu
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <strong>De:</strong> {selectedMessage.expediteurNom}
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <strong>Email:</strong> {selectedMessage.expediteurEmail}
                        </div>
                        {selectedMessage.expediteurTelephone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <strong>Téléphone:</strong> {selectedMessage.expediteurTelephone}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <strong>Reçu le:</strong> {new Date(selectedMessage.dateEnvoi).toLocaleString('fr-FR')}
                        </div>
                      </CardDescription>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectedMessage.lu 
                          ? handleMarkAsUnread(selectedMessage) 
                          : handleMarkAsRead(selectedMessage)
                        }
                      >
                        {selectedMessage.lu ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Marquer non lu
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Marquer comme lu
                          </>
                        )}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(selectedMessage.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
                        {selectedMessage.contenu}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full py-20">
                  <div className="text-center text-gray-500">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">Sélectionnez un message</h3>
                    <p>Choisissez un message dans la liste pour le lire</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
