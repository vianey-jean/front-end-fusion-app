
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsAPI } from '@/services/settingsAPI';
import { Settings, GeneralSettings, NotificationSettings } from '@/types/settings';
import { toast } from 'sonner';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsAPI.getSettings,
    staleTime: 2 * 60 * 1000, // 2 minutes au lieu de 30 secondes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1, // Une seule tentative
    retryDelay: 30000, // 30 secondes entre les tentatives
  });

  const updateGeneralMutation = useMutation({
    mutationFn: settingsAPI.updateGeneralSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      toast.success('Paramètres généraux mis à jour avec succès');
      
      // Recharger la page si le mode maintenance a changé
      if (data.general?.maintenanceMode !== settings?.general?.maintenanceMode) {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    },
    onError: (error: any) => {
      console.error('Erreur lors de la mise à jour des paramètres généraux:', error);
      
      // Gestion spéciale pour les erreurs 429
      if (error.response?.status === 429) {
        toast.error('Trop de requêtes. Veuillez patienter avant de réessayer.');
      } else {
        toast.error('Erreur lors de la mise à jour des paramètres généraux');
      }
    },
  });

  const updateNotificationMutation = useMutation({
    mutationFn: settingsAPI.updateNotificationSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['settings'], data);
      toast.success('Paramètres de notification mis à jour avec succès');
    },
    onError: (error: any) => {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
      
      // Gestion spéciale pour les erreurs 429
      if (error.response?.status === 429) {
        toast.error('Trop de requêtes. Veuillez patienter avant de réessayer.');
      } else {
        toast.error('Erreur lors de la mise à jour des paramètres de notification');
      }
    },
  });

  const backupMutation = useMutation({
    mutationFn: settingsAPI.createManualBackup,
    onSuccess: (data) => {
      toast.success('Sauvegarde créée avec succès');
    },
    onError: (error: any) => {
      console.error('Erreur lors de la création de la sauvegarde:', error);
      
      // Gestion spéciale pour les erreurs 429
      if (error.response?.status === 429) {
        toast.error('Trop de requêtes. Veuillez patienter avant de réessayer.');
      } else {
        toast.error('Erreur lors de la création de la sauvegarde');
      }
    },
  });

  return {
    settings,
    isLoading,
    error,
    updateGeneralSettings: updateGeneralMutation.mutate,
    updateNotificationSettings: updateNotificationMutation.mutate,
    createManualBackup: backupMutation.mutate,
    isUpdatingGeneral: updateGeneralMutation.isPending,
    isUpdatingNotifications: updateNotificationMutation.isPending,
    isCreatingBackup: backupMutation.isPending,
  };
};
