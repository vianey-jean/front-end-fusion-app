
import { api } from '@/service/api';

export interface Message {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  dateEnvoi: string;
  isRead: boolean;
}

export const messageService = {
  // Récupérer tous les messages
  async getAllMessages(): Promise<Message[]> {
    try {
      const response = await api.get('/api/messages');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      return [];
    }
  },

  // Envoyer un nouveau message
  async sendMessage(messageData: Omit<Message, 'id' | 'dateEnvoi' | 'isRead'>): Promise<Message> {
    try {
      const response = await api.post('/api/messages', {
        ...messageData,
        dateEnvoi: new Date().toISOString(),
        isRead: false
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }
  },

  // Marquer un message comme lu
  async markAsRead(messageId: string): Promise<void> {
    try {
      await api.put(`/api/messages/${messageId}/read`);
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  },

  // Marquer un message comme non lu
  async markAsUnread(messageId: string): Promise<void> {
    try {
      await api.put(`/api/messages/${messageId}/unread`);
    } catch (error) {
      console.error('Erreur lors du marquage comme non lu:', error);
      throw error;
    }
  },

  // Supprimer un message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await api.delete(`/api/messages/${messageId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression du message:', error);
      throw error;
    }
  },

  // Compter les messages non lus
  async getUnreadCount(): Promise<number> {
    try {
      const response = await api.get('/api/messages/unread-count');
      return response.data.count;
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
      return 0;
    }
  }
};
