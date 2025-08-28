
import { useEffect, useState, useRef } from 'react';
import { playNotificationSound } from '@/utils/audio-utils';

interface ChatNotificationHook {
  unreadCount: number;
  resetNotifications: () => void;
}

export const useChatNotifications = (
  isOpen: boolean,
  isMinimized: boolean,
  currentUnreadCount: number
): ChatNotificationHook => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [previousCount, setPreviousCount] = useState(0);
  const hasPlayedSoundRef = useRef(false);

  // Mettre à jour le compteur de messages non lus
  useEffect(() => {
    if (currentUnreadCount !== previousCount) {
      // Si le nombre de messages non lus a augmenté et que le chat est fermé ou minimisé
      if (currentUnreadCount > previousCount && (!isOpen || isMinimized)) {
        // Jouer le son seulement si on n'a pas déjà joué pour ce nouveau message
        if (!hasPlayedSoundRef.current) {
          playNotificationSound('/notification-bip.mp3');
          hasPlayedSoundRef.current = true;
          
          // Reset le flag après un court délai
          setTimeout(() => {
            hasPlayedSoundRef.current = false;
          }, 1000);
        }
      }
      
      setUnreadCount(currentUnreadCount);
      setPreviousCount(currentUnreadCount);
    }
  }, [currentUnreadCount, previousCount, isOpen, isMinimized]);

  // Réinitialiser le compteur quand le chat est ouvert et pas minimisé
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
    }
  }, [isOpen, isMinimized]);

  const resetNotifications = () => {
    setUnreadCount(0);
    setPreviousCount(0);
  };

  return {
    unreadCount: (!isOpen || isMinimized) ? unreadCount : 0,
    resetNotifications
  };
};
