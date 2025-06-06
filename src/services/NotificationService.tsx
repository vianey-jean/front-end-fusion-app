
import React from 'react';
import { format, differenceInHours, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Info, ShoppingCart, Heart, Package, CreditCard, User, Mail, Shield, Clock, Cookie, Wrench, Gift, Wifi } from 'lucide-react';

// Définition de l'interface Appointment ici pour éviter les dépendances circulaires
export interface Appointment {
  id: number | string;
  userId: number | string;
  titre: string;
  description: string;
  date: string;
  heure: string;
  duree: number;
  location: string;
  lieu?: string;
}

const NOTIFICATION_SOUND_BASE64 = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA/+M4wAAAAAAAAAAAAEluZm8AAAAPAAAAAwAAAbAAyMjIyMjIyMjIyMjIyMjIyMjI8PDw8PDw8PDw8PDw8PDw8PDw////////////////////////////////////////////AAAAAExhdmM1OC4xMwAAAAAAAAAAAAAAACQDQAAAAAABsLlBxsIAAAAAAAAAAAAAAAD/+xDEAAAEMi1tU0EAEPJyabE8Y1RTTVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWpqqqqqqqqqqqqqqqqqqqqqqqqqqqqANDK4EnF+P/7EMQjA8VmIj5jCgBJLcSiznOquMS7JE3an0hiiYOntN9UKUp/3fh//5cJyf/93X6gCBoMXXUpORDtx9QsXvuCVKXudmW3cd/z/oPfj6X2rL7XioSO3ehZRYmH94vto3//yPX5v+j6cvaebkAAAAECLzkATJEoEikA//sQxCgDxWYhKDOMAGBBP6KBAYAA/8PCkqxUKihlMqHQOBwEBwKAwCAMYcUCgDm2Kn7kGP/////8ioRCIRCMQHmKhCrVQ1DUNTDUNQ1DUQiEQjP//////2dCMQiMQiESiVT6KGQQIpZCh08IDwcOCAHmBoEGAgQDQIDA4GBgwPBx6JJlJ//7EMQ3gAnptVAShgBlCcGsQWGAARuCfHGB5YwMC4XnmgYXC84OCB/eTU1NTU1Pii0rOQ/5R/KP5Q6ammppqavi//KJ/lE+UOHf///6Jphif+UT/KL/KHQTimoqf//ohCE1P///+h0T//////////5oQhP/////uhCEJ//sQxEEDyKIvqAmBHmkDxmZkAYABqf////L////8v//////5Q6HTUTf5Q6L///////oQi//5Q6IE1NTU1NTU0wQHDB5J5J5N5N5N5JodDodDodDodFRUVFRUVdXV1dXV1dXWWWWWZZZlmWZZn/////////////////9//+xDEWgPHAhAfwzAAAAAXkznAAP///////////////4REQiIRCIREQiIRCIREQiIRCIREQiIRCIREQiIRCIREQiIRCPiIREJERCJERCJERCJERCJERCJERCJERCJERCJERCJEQiIh//////////////////sQxIKDwAABpAAAACAAANIAAAAT//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8=";

// Enhanced notification service with modern e-commerce styling
export const NotificationService = {
  // Clé pour le stockage local des notifications confirmées
  CONFIRMED_NOTIFICATIONS_KEY: 'confirmed_notifications',

  // Récupérer les notifications confirmées
  getConfirmedNotifications: (): string[] => {
    const confirmed = localStorage.getItem(NotificationService.CONFIRMED_NOTIFICATIONS_KEY);
    return confirmed ? JSON.parse(confirmed) : [];
  },

  // Ajouter une notification confirmée
  addConfirmedNotification: (appointmentId: number | string): void => {
    const confirmed = NotificationService.getConfirmedNotifications();
    if (!confirmed.includes(String(appointmentId))) {
      confirmed.push(String(appointmentId));
      localStorage.setItem(NotificationService.CONFIRMED_NOTIFICATIONS_KEY, JSON.stringify(confirmed));
    }
  },

  // Vérifier si une notification est déjà confirmée
  isNotificationConfirmed: (appointmentId: number | string): boolean => {
    const confirmed = NotificationService.getConfirmedNotifications();
    return confirmed.includes(String(appointmentId));
  },

  // Jouer le son de notification
  playNotificationSound: (): void => {
    try {
      const audio = new Audio(NOTIFICATION_SOUND_BASE64);
      audio.play().catch(error => {
        console.error("Erreur lors de la lecture du son:", error);
      });
    } catch (error) {
      console.error("Erreur lors de la création de l'audio:", error);
    }
  },

  // Show enhanced notifications with modern styling
  showSuccess: (title: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="font-bold">{title}</span>
        </div>
      ),
      description,
      className: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 4000,
    });
  },

  showError: (title: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <XCircle className="h-5 w-5 text-red-300" />
          <span className="font-bold">{title}</span>
        </div>
      ),
      description,
      variant: "destructive",
      className: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 5000,
    });
  },

  showWarning: (title: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-300" />
          <span className="font-bold">{title}</span>
        </div>
      ),
      description,
      className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 4000,
    });
  },

  showInfo: (title: string, description?: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <Info className="h-5 w-5 text-blue-300" />
          <span className="font-bold">{title}</span>
        </div>
      ),
      description,
      className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 4000,
    });
  },

  // E-commerce specific notifications with modern styling
  addToCart: (productName: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <ShoppingCart className="h-5 w-5 text-emerald-300" />
          <span className="font-bold">Produit ajouté au panier</span>
        </div>
      ),
      description: `${productName} a été ajouté avec succès`,
      className: "bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 3000,
    });
  },

  addToFavorites: (productName: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-pink-300" />
          <span className="font-bold">Ajouté aux favoris</span>
        </div>
      ),
      description: `${productName} est maintenant dans vos favoris`,
      className: "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 3000,
    });
  },

  orderPlaced: (orderNumber: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5 text-purple-300" />
          <span className="font-bold">Commande confirmée</span>
        </div>
      ),
      description: `Votre commande ${orderNumber} a été validée avec succès`,
      className: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 5000,
    });
  },

  paymentSuccess: () => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-green-300" />
          <span className="font-bold">Paiement réussi</span>
        </div>
      ),
      description: "Votre paiement a été traité avec succès",
      className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 4000,
    });
  },

  paymentError: () => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-red-300" />
          <span className="font-bold">Erreur de paiement</span>
        </div>
      ),
      description: "Le paiement n'a pas pu être traité. Veuillez réessayer.",
      variant: "destructive",
      className: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 5000,
    });
  },

  loginSuccess: (userName: string) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-300" />
          <span className="font-bold">Connexion réussie</span>
        </div>
      ),
      description: `Bienvenue ${userName}`,
      className: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 3000,
    });
  },

  networkError: () => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <Wifi className="h-5 w-5 text-red-300" />
          <span className="font-bold">Erreur de connexion</span>
        </div>
      ),
      description: "Vérifiez votre connexion internet et réessayez",
      variant: "destructive",
      className: "bg-gradient-to-r from-red-500 to-rose-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 5000,
    });
  },

  promoCodeApplied: (discount: number) => {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <Gift className="h-5 w-5 text-yellow-300" />
          <span className="font-bold">Code promo appliqué</span>
        </div>
      ),
      description: `Réduction de ${discount}% accordée sur votre commande`,
      className: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
      duration: 4000,
    });
  },

  // Afficher les notifications pour les rendez-vous à venir dans moins de 24h
  showAppointmentNotifications: (appointments: Appointment[]): void => {
    if (!appointments || appointments.length === 0) return;

    const now = new Date();
    const upcomingAppointments = appointments.filter(appointment => {
      // Vérifier si la notification a déjà été confirmée
      if (NotificationService.isNotificationConfirmed(appointment.id)) {
        return false;
      }

      try {
        // Créer une date à partir de la date et l'heure du rendez-vous
        const appointmentDate = parseISO(`${appointment.date}T${appointment.heure}`);
        
        // Calculer la différence en heures
        const hoursDifference = differenceInHours(appointmentDate, now);
        
        // Retourner true si le rendez-vous est dans moins de 24h mais n'est pas encore passé
        return hoursDifference > 0 && hoursDifference <= 24;
      } catch (error) {
        console.error("Erreur lors du calcul de la date:", error);
        return false;
      }
    });

    // Afficher une notification pour chaque rendez-vous à venir
    upcomingAppointments.forEach(appointment => {
      try {
        const appointmentDate = parseISO(`${appointment.date}T${appointment.heure}`);
        const formattedDate = format(appointmentDate, "dd/MM/yyyy 'à' HH:mm", { locale: fr });
        const location = appointment.lieu || appointment.location || "";
        
        // Jouer le son de notification
        NotificationService.playNotificationSound();
        
        // Afficher la notification avec style moderne
        toast({
          title: (
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-300" />
              <span className="font-bold">Rappel de rendez-vous</span>
            </div>
          ),
          description: `Vous avez un rendez-vous le ${formattedDate} à ${location} : "${appointment.description}"`,
          action: (
            <Button 
              onClick={() => NotificationService.addConfirmedNotification(appointment.id)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              size="sm"
            >
              Compris
            </Button>
          ),
          className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-2xl backdrop-blur-sm rounded-xl",
          duration: 10000,
        });
      } catch (error) {
        console.error("Erreur lors de l'affichage de la notification:", error);
      }
    });
  }
};

export function useNotificationService(appointments: Appointment[]) {
  React.useEffect(() => {
    if (appointments && appointments.length > 0) {
      NotificationService.showAppointmentNotifications(appointments);
    }
  }, [appointments]);

  const resetNotifications = () => {
    localStorage.removeItem(NotificationService.CONFIRMED_NOTIFICATIONS_KEY);
  };

  return {
    resetNotifications,
  };
}
