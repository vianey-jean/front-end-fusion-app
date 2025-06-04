
import { API } from './apiConfig';

export interface MaintenanceData {
  maintenance: boolean;
  description: string;
  updatedAt?: string;
}

export const maintenanceAPI = {
  // Récupérer les données de maintenance
  getMaintenanceStatus: async (): Promise<MaintenanceData> => {
    const response = await API.get('/maintenance');
    return response.data;
  },

  // Mettre à jour les données de maintenance
  updateMaintenanceStatus: async (data: Partial<MaintenanceData>): Promise<MaintenanceData> => {
    const response = await API.put('/maintenance', data);
    return response.data;
  }
};
