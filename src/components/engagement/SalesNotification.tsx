
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, MapPin, Clock, Users, Star, TrendingUp, Package } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

interface SaleNotification {
  id: string;
  customerName: string;
  productName: string;
  location: string;
  timeAgo: string;
  type: 'purchase' | 'review' | 'signup' | 'trending';
  amount?: number;
  rating?: number;
}

const SalesNotification: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<SaleNotification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<SaleNotification | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Only show if user is admin
  const isAdmin = user?.role === 'admin' || user?.email === 'admin@admin.com';

  // Notifications factices améliorées
  const mockNotifications: SaleNotification[] = [
    {
      id: '1',
      customerName: 'Marie L.',
      productName: 'iPhone 15 Pro',
      location: 'Paris',
      timeAgo: 'il y a 3 minutes',
      type: 'purchase',
      amount: 1299
    },
    {
      id: '2',
      customerName: 'Thomas M.',
      productName: 'Samsung Galaxy S24',
      location: 'Lyon',
      timeAgo: 'il y a 7 minutes',
      type: 'purchase',
      amount: 899
    },
    {
      id: '3',
      customerName: 'Sophie D.',
      productName: 'Casque Gaming Premium',
      location: 'Marseille',
      timeAgo: 'il y a 12 minutes',
      type: 'review',
      rating: 5
    },
    {
      id: '4',
      customerName: 'Lucas B.',
      productName: '',
      location: 'Toulouse',
      timeAgo: 'il y a 15 minutes',
      type: 'signup'
    },
    {
      id: '5',
      customerName: 'Emma R.',
      productName: 'MacBook Pro M3',
      location: 'Nice',
      timeAgo: 'il y a 20 minutes',
      type: 'trending'
    }
  ];

  useEffect(() => {
    if (isAdmin) {
      setNotifications(mockNotifications);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin || notifications.length === 0) return;

    let currentIndex = 0;
    
    const showNextNotification = () => {
      setCurrentNotification(notifications[currentIndex]);
      setIsVisible(true);
      
      setTimeout(() => setIsVisible(false), 5000);
      
      currentIndex = (currentIndex + 1) % notifications.length;
    };

    // Afficher la première notification après 5 secondes
    const initialTimer = setTimeout(showNextNotification, 5000);
    
    // Puis afficher une nouvelle notification toutes les 12 secondes
    const interval = setInterval(showNextNotification, 12000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [notifications, isAdmin]);

  if (!isAdmin || !currentNotification) return null;

  const getNotificationContent = (notification: SaleNotification) => {
    switch (notification.type) {
      case 'purchase':
        return {
          icon: <ShoppingCart className="h-5 w-5 text-emerald-600" />,
          title: '🎉 Nouvelle commande !',
          message: `${notification.customerName} a acheté "${notification.productName}"`,
          bgGradient: 'from-emerald-50 via-green-50 to-teal-50',
          borderColor: 'border-emerald-200',
          accentColor: 'text-emerald-600',
          amount: notification.amount
        };
      case 'review':
        return {
          icon: <Star className="h-5 w-5 text-yellow-600" />,
          title: '⭐ Nouvel avis !',
          message: `${notification.customerName} a laissé un avis ${notification.rating}/5 étoiles`,
          bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
          borderColor: 'border-yellow-200',
          accentColor: 'text-yellow-600',
          rating: notification.rating
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
      case 'trending':
        return {
          icon: <TrendingUp className="h-5 w-5 text-pink-600" />,
          title: '🔥 Produit tendance !',
          message: `"${notification.productName}" est très demandé`,
          bgGradient: 'from-pink-50 via-rose-50 to-red-50',
          borderColor: 'border-pink-200',
          accentColor: 'text-pink-600'
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
          initial={{ x: -450, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -450, opacity: 0, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 200,
            duration: 0.6
          }}
          className="fixed bottom-6 left-6 z-50 max-w-sm"
        >
          <motion.div
            className={`bg-gradient-to-r ${content.bgGradient} border-2 ${content.borderColor} rounded-2xl p-5 shadow-2xl backdrop-blur-sm relative overflow-hidden`}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Effet de brillance animé */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
              }}
              style={{ transform: 'skewX(-25deg)' }}
            />
            
            <div className="flex items-start space-x-4 relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
                  <AvatarFallback className="bg-white/90 text-gray-700 text-sm font-semibold">
                    {currentNotification.customerName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <motion.div 
                  className="flex items-center space-x-2 mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {content.icon}
                  <p className="text-sm font-bold text-gray-900">
                    {content.title}
                  </p>
                </motion.div>
                
                <motion.p 
                  className="text-sm text-gray-800 line-clamp-2 font-medium"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {content.message}
                </motion.p>
                
                {content.amount && (
                  <motion.div 
                    className="mt-2 inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    💰 {content.amount}€
                  </motion.div>
                )}
                
                {content.rating && (
                  <motion.div 
                    className="mt-2 flex items-center space-x-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {[...Array(content.rating)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </motion.div>
                )}
                
                <motion.div 
                  className="flex items-center space-x-3 mt-3 text-xs text-gray-600"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span className="font-medium">{currentNotification.location}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{currentNotification.timeAgo}</span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Barre de progression améliorée */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-b-2xl"
            />
            
            {/* Petits éléments décoratifs */}
            <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse" />
            <div className="absolute bottom-3 right-3 w-1 h-1 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalesNotification;
