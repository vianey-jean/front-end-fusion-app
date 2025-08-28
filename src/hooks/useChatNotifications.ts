
import { useState, useEffect, useCallback } from 'react';
import { playNotificationSound } from '@/utils/audio-utils';

interface ChatNotificationState {
  unreadCount: number;
  isMinimized: boolean;
  isClosed: boolean;
}

export const useChatNotifications = (chatId: string) => {
  const [notificationState, setNotificationState] = useState<ChatNotificationState>({
    unreadCount: 0,
    isMinimized: false,
    isClosed: false
  });

  // Fonction pour ajouter une nouvelle notification
  const addNotification = useCallback(() => {
    setNotificationState(prev => {
      const newCount = prev.unreadCount + 1;
      
      // Jouer le son seulement si le chat est minimisé ou fermé
      if (prev.isMinimized || prev.isClosed) {
        playNotificationSound();
      }
      
      return {
        ...prev,
        unreadCount: newCount
      };
    });
  }, []);

  // Fonction pour réinitialiser les notifications
  const clearNotifications = useCallback(() => {
    setNotificationState(prev => ({
      ...prev,
      unreadCount: 0
    }));
  }, []);

  // Fonction pour définir l'état du chat
  const setChatState = useCallback((isMinimized: boolean, isClosed: boolean) => {
    setNotificationState(prev => ({
      ...prev,
      isMinimized,
      isClosed,
      // Réinitialiser le compteur si le chat est ouvert et non minimisé
      unreadCount: (!isMinimized && !isClosed) ? 0 : prev.unreadCount
    }));
  }, []);

  return {
    unreadCount: notificationState.unreadCount,
    addNotification,
    clearNotifications,
    setChatState
  };
};
