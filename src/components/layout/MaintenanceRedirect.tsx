
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { maintenanceAPI } from '@/services/maintenanceAPI';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';

interface MaintenanceRedirectProps {
  children: React.ReactNode;
}

const MaintenanceRedirect: React.FC<MaintenanceRedirectProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const { data: maintenanceData, isLoading, error } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceAPI.getMaintenanceStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes au lieu de 30 secondes
    refetchInterval: 3 * 60 * 1000, // 3 minutes au lieu de 1 minute
    retry: 1, // Une seule tentative
    retryDelay: 30000, // 30 secondes entre les tentatives
    refetchOnWindowFocus: false, // Désactiver le refresh au focus
    refetchOnReconnect: false, // Désactiver le refresh à la reconnexion
  });

  // Afficher les logs pour debugging seulement en développement
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('MaintenanceRedirect - Maintenance data:', maintenanceData);
      console.log('MaintenanceRedirect - Current path:', location.pathname);
      console.log('MaintenanceRedirect - User:', user);
      console.log('MaintenanceRedirect - Maintenance mode:', maintenanceData?.maintenance);
    }
  }, [maintenanceData, location.pathname, user]);

  // Si les données sont en cours de chargement, on laisse passer
  if (isLoading) {
    return <>{children}</>;
  }

  // Si erreur de chargement, on laisse passer (éviter les boucles d'erreur)
  if (error) {
    console.warn('MaintenanceRedirect - Error loading maintenance data, allowing access');
    return <>{children}</>;
  }

  // Pages autorisées pendant la maintenance
  const allowedPaths = [
    '/maintenance',
    getSecureRoute('/login'),
    '/login',
    getSecureRoute('/admin/parametres'),
    '/admin/parametres'
  ];

  // Vérifier si c'est une page admin (tous les chemins admin sont autorisés)
  const isAdminPage = location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith(getSecureRoute('/admin') || '');

  // Si le mode maintenance est activé
  if (maintenanceData?.maintenance) {
    // Si l'utilisateur est admin, laisser passer sur toutes les pages admin
    if (user && user.role === 'admin' && isAdminPage) {
      return <>{children}</>;
    }

    // Si c'est une page autorisée, laisser passer
    if (allowedPaths.some(path => path && location.pathname.startsWith(path))) {
      return <>{children}</>;
    }

    // Sinon, rediriger vers la page de maintenance
    return <Navigate to="/maintenance" replace />;
  }

  // Mode maintenance désactivé, laisser passer
  return <>{children}</>;
};

export default MaintenanceRedirect;
