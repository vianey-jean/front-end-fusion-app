
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

interface PubLayout {
  id: string;
  icon: string;
  text: string;
}

const pubLayoutAPI = {
  // Récupérer toutes les publicités
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pub-layout`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des publicités:', error);
      throw error;
    }
  },

  // Ajouter une nouvelle publicité
  add: async (pubData: { icon: string; text: string }) => {
    try {
      const response = await axios.post(`${API_URL}/api/pub-layout`, pubData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'une publicité:', error);
      throw error;
    }
  },

  // Mettre à jour une publicité
  update: async (id: string, pubData: { icon: string; text: string }) => {
    try {
      const response = await axios.put(`${API_URL}/api/pub-layout/${id}`, pubData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour d\'une publicité:', error);
      throw error;
    }
  },

  // Supprimer une publicité
  delete: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/api/pub-layout/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression d\'une publicité:', error);
      throw error;
    }
  }
};

export type { PubLayout };
export default pubLayoutAPI;
