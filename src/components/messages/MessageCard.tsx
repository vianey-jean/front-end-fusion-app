
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Message } from '@/services/messageService';
import { Trash2, Mail, MailOpen, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageCardProps {
  message: Message;
  onMarkAsRead: (id: string) => void;
  onMarkAsUnread: (id: string) => void;
  onDelete: (id: string) => void;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  onMarkAsRead,
  onMarkAsUnread,
  onDelete
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleToggleReadStatus = () => {
    if (message.isRead) {
      onMarkAsUnread(message.id);
    } else {
      onMarkAsRead(message.id);
    }
  };

  const handleDelete = () => {
    onDelete(message.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card className={`transition-all duration-200 hover:shadow-lg ${
        !message.isRead 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : 'bg-white dark:bg-gray-800'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {!message.isRead && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Non lu
                </Badge>
              )}
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {message.sujet}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleReadStatus}
                className="h-8 w-8 p-0"
              >
                {message.isRead ? (
                  <Mail className="h-4 w-4" />
                ) : (
                  <MailOpen className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{message.nom}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(message.dateEnvoi), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Email:</strong> {message.email}
            </p>
          </div>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {message.message}
            </p>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
