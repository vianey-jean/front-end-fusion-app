
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MapPin, Clock, Users, Star, TrendingUp, Package, Bell } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { notificationAPI, SaleNotification, NotificationResponse } from '@/services/notificationAPI';
import { useAuth } from '@/contexts/AuthContext';

// Intervalle de vérification pour les nouvelles notifications (en ms)
const POLLING_INTERVAL = 10000;

const RealtimeSalesNotifier: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState<SaleNotification | null>(null);
  const [orderStats, setOrderStats] = useState<{ today: number; week: number; month: number; year: number }>({
    today: 0,
    week: 0,
    month: 0,
    year: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<string>(new Date().toISOString());
  const [isAdmin, setIsAdmin] = useState(false);

  // Utiliser le contexte d'authentification de manière sécurisée
  useEffect(() => {
    const checkAdminStatus = () => {
      try {
        // Méthode 1: Essayer d'utiliser le contexte d'authentification
        const auth = useAuth();
        if (auth && auth.user && auth.isAdmin) {
          setIsAdmin(true);
          console.log('Admin détecté via contexte d\'authentification');
          return;
        }
      } catch (error) {
        console.log('Contexte d\'authentification non disponible, essai avec localStorage');
      }

      try {
        // Méthode 2: Vérifier dans localStorage
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          const user = JSON.parse(userStr);
          if (user.role === 'admin' || user.email === 'admin@admin.com') {
            setIsAdmin(true);
            console.log('Admin détecté via localStorage');
            return;
          }
        }

        // Méthode 3: Décoder le token JWT
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.role === 'admin' || payload.email === 'admin@admin.com') {
            setIsAdmin(true);
            console.log('Admin détecté via token JWT');
            return;
          }
        }
      } catch (error) {
        console.log('Impossible de vérifier le statut admin:', error);
      }
      
      setIsAdmin(false);
    };

    checkAdminStatus();
    
    // Vérifier périodiquement le statut admin
    const interval = setInterval(checkAdminStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fonction pour récupérer la dernière notification
  const fetchLatestNotification = async () => {
    try {
      const { data } = await notificationAPI.getLatest(lastCheckTime);
      if (data.notification) {
        setCurrentNotification(data.notification);
        setLastCheckTime(new Date().toISOString());
        setIsVisible(true);
        
        // Cacher la notification après 5 secondes
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      }
      
      // Toujours mettre à jour les statistiques de commandes
      setOrderStats(data.orderStats);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  // Vérifier les nouvelles notifications au chargement du composant
  useEffect(() => {
    if (isAdmin) {
      console.log('Admin connecté - Activation des notifications de vente');
      fetchLatestNotification();
      
      // Mettre en place un intervalle pour vérifier régulièrement les nouvelles notifications
      const intervalId = setInterval(fetchLatestNotification, POLLING_INTERVAL);
      
      return () => {
        clearInterval(intervalId);
      };
    } else {
      console.log('Utilisateur non-admin - Pas de notifications de vente');
    }
  }, [isAdmin, lastCheckTime]);

  // Si pas admin ou pas de notification, ne rien afficher
  if (!isAdmin || !currentNotification) return null;

  // Déterminer le type de notification en fonction des données
  const getNotificationType = (notification: SaleNotification) => {
    if (notification.productId) return 'purchase';
    if (notification.name?.includes('avis') || notification.name?.includes('review')) return 'review';
    if (!notification.name && notification.customerName) return 'signup';
    return 'purchase';
  };

  // Configurer l'affichage en fonction du type de notification
  const getNotificationContent = (notification: SaleNotification) => {
    const notificationType = getNotificationType(notification);
    
    switch (notificationType) {
      case 'purchase':
        return {
          icon: <ShoppingCart className="h-5 w-5 text-emerald-600" />,
          title: '🎉 Nouvelle commande !',
          message: `${notification.customerName} a acheté "${notification.name}"`,
          bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600',
          amount: notification.price
        };
      case 'review':
        return {
          icon: <Star className="h-5 w-5 text-yellow-600" />,
          title: '⭐ Nouvel avis !',
          message: `${notification.customerName} a laissé un avis`,
          bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
          borderColor: 'border-yellow-200',
          accentColor: 'text-yellow-600'
        };
      case 'signup':
        return {
          icon: <Users className="h-5 w-5 text-blue-600" />,
          title: '👋 Nouveau membre !',
          message: `${notification.customerName} vient de s'inscrire`,
          bgGradient: 'from-blue-50 via-indigo-50 to-purple-50',
          borderColor: 'border-blue-200',
          accentColor: 'text-blue-600'
        };
      default:
        return {
          icon: <Package className="h-5 w-5 text-gray-600" />,
          title: '📢 Notification',
          message: notification.customerName,
          bgGradient: 'from-gray-50 via-slate-50 to-zinc-50',
          borderColor: 'border-gray-200',
          accentColor: 'text-gray-600'
        };
    }
  };

  const content = getNotificationContent(currentNotification);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 300,
            duration: 0.4
          }}
          className="fixed top-20 right-6 z-50 max-w-sm"
        >
          <div className={`bg-gradient-to-r ${content.bgGradient} border-2 ${content.borderColor} rounded-2xl p-4 shadow-xl backdrop-blur-sm`}>
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-white/80 text-gray-700 text-sm">
                  {currentNotification.customerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {content.icon}
                  <p className="text-sm font-semibold text-gray-900">
                    {content.title}
                  </p>
                </div>
                
                <p className="text-sm text-gray-800 line-clamp-2">
                  {content.message}
                </p>
                
                {currentNotification.price && (
                  <div className="mt-2 inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    💰 {currentNotification.price}€
                  </div>
                )}
                
                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{currentNotification.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{currentNotification.timeAgo}</span>
                  </div>
                </div>
              </div>
              
              {/* Badge indiquant les commandes du jour */}
              {orderStats.today > 0 && (
                <div className="bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold flex items-center">
                  <Bell className="h-3 w-3 mr-1" />
                  {orderStats.today}
                </div>
              )}
            </div>
            
            {/* Barre de progression */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-lg"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealtimeSalesNotifier;
