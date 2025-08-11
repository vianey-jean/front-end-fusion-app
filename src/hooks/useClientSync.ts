
import { useState, useEffect } from 'react';
import { realtimeService } from '@/services/realtimeService';
import axios from 'axios';

interface Client {
  id: string;
  nom: string;
  phone: string;
  adresse: string;
  dateCreation: string;
}

export const useClientSync = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';
      
      const response = await axios.get(`${API_BASE_URL}/api/clients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setClients(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();

    // Écouter les changements en temps réel
    const unsubscribe = realtimeService.addDataListener((data) => {
      if (data.clients) {
        setClients(data.clients);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const searchClients = (query: string): Client[] => {
    if (query.length < 3) return [];
    
    return clients.filter(client => 
      client.nom.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    clients,
    isLoading,
    searchClients,
    refetch: fetchClients
  };
};
