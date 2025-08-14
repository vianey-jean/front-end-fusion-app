
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

class MessageService {
  // Récupérer tous les messages
  async getAllMessages(): Promise<Message[]> {
    try {
      console.log('📧 Récupération des messages...');
      const response = await api.get('/api/messages');
      console.log('✅ Messages récupérés:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des messages:', error);
      return [];
    }
  }

  // Envoyer un nouveau message
  async sendMessage(messageData: Omit<Message, 'id' | 'dateEnvoi' | 'isRead'>): Promise<Message> {
    try {
      console.log('📤 Envoi d\'un nouveau message:', messageData);
      const response = await api.post('/api/messages', {
        ...messageData,
        dateEnvoi: new Date().toISOString(),
        isRead: false
      });
      console.log('✅ Message envoyé avec succès:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi du message:', error);
      throw new Error('Impossible d\'envoyer le message. Veuillez réessayer.');
    }
  }

  // Marquer un message comme lu
  async markAsRead(messageId: string): Promise<void> {
    try {
      console.log('👁️ Marquage comme lu:', messageId);
      await api.put(`/api/messages/${messageId}/read`);
      console.log('✅ Message marqué comme lu');
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme lu:', error);
      throw new Error('Impossible de marquer le message comme lu.');
    }
  }

  // Marquer un message comme non lu
  async markAsUnread(messageId: string): Promise<void> {
    try {
      console.log('📧 Marquage comme non lu:', messageId);
      await api.put(`/api/messages/${messageId}/unread`);
      console.log('✅ Message marqué comme non lu');
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme non lu:', error);
      throw new Error('Impossible de marquer le message comme non lu.');
    }
  }

  // Supprimer un message
  async deleteMessage(messageId: string): Promise<void> {
    try {
      console.log('🗑️ Suppression du message:', messageId);
      await api.delete(`/api/messages/${messageId}`);
      console.log('✅ Message supprimé avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression du message:', error);
      throw new Error('Impossible de supprimer le message.');
    }
  }

  // Compter les messages non lus
  async getUnreadCount(): Promise<number> {
    try {
      console.log('🔢 Comptage des messages non lus...');
      const response = await api.get('/api/messages/unread-count');
      console.log('✅ Nombre de messages non lus:', response.data.count);
      return response.data.count;
    } catch (error) {
      console.error('❌ Erreur lors du comptage des messages non lus:', error);
      return 0;
    }
  }
}

export const messageService = new MessageService();
