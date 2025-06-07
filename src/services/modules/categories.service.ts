
/**
 * Service API pour la gestion des catégories
 * 
 * Fournit toutes les méthodes pour interagir avec l'API backend
 * concernant les catégories de produits (CRUD complet)
 */

import { apiClient } from '../core/apiClient';
import { Category, CategoryFormData } from '@/types/category';
import { getSecureId, getRealId } from '@/services/secureIds';

// Object contenant toutes les méthodes d'interaction avec l'API des catégories
export const categoriesService = {
  // Récupérer toutes les catégories (actives et inactives) avec IDs sécurisés
  getAll: async () => {
    const response = await apiClient.get<Category[]>('/categories');
    if (response.data) {
      response.data = response.data.map(category => ({
        ...category,
        secureId: getSecureId(category.id, 'product')
      }));
    }
    return response;
  },
  
  // Récupérer uniquement les catégories actives (pour affichage public) avec IDs sécurisés
  getActive: async () => {
    const response = await apiClient.get<Category[]>('/categories/active');
    if (response.data) {
      response.data = response.data.map(category => ({
        ...category,
        secureId: getSecureId(category.id, 'product')
      }));
    }
    return response;
  },
  
  // Récupérer une catégorie spécifique par son ID sécurisé
  getById: (secureId: string) => {
    const realId = getRealId(secureId);
    if (!realId) {
      throw new Error('ID de catégorie invalide');
    }
    return apiClient.get<Category>(`/categories/${realId}`);
  },
  
  // Créer une nouvelle catégorie
  create: (data: CategoryFormData) => apiClient.post<Category>('/categories', data),
  
  // Mettre à jour une catégorie existante (mise à jour partielle possible)
  update: (secureId: string, data: Partial<CategoryFormData>) => {
    const realId = getRealId(secureId);
    if (!realId) {
      throw new Error('ID de catégorie invalide');
    }
    return apiClient.put<Category>(`/categories/${realId}`, data);
  },
  
  // Supprimer une catégorie
  delete: (secureId: string) => {
    const realId = getRealId(secureId);
    if (!realId) {
      throw new Error('ID de catégorie invalide');
    }
    return apiClient.delete(`/categories/${realId}`);
  },
};
