
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
    staleTime: 30000, // Augmenter à 30 secondes
    refetchInterval: 60000, // Réduire à toutes les minutes
    retry: 1, // Réduire les tentatives
    retryDelay: 10000, // Délai de 10 secondes entre les tentatives
  });

  // Afficher les logs pour debugging
  React.useEffect(() => {
    console.log('MaintenanceRedirect - Maintenance data:', maintenanceData);
    console.log('MaintenanceRedirect - Current path:', location.pathname);
    console.log('MaintenanceRedirect - User:', user);
    console.log('MaintenanceRedirect - Maintenance mode:', maintenanceData?.maintenance);
  }, [maintenanceData, location.pathname, user]);

  // Si les données sont en cours de chargement, on laisse passer
  if (isLoading) {
    console.log('MaintenanceRedirect - Loading maintenance data...');
    return <>{children}</>;
  }

  // Si erreur de chargement, on laisse passer
  if (error) {
    console.log('MaintenanceRedirect - Error loading maintenance data:', error);
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
    console.log('MaintenanceRedirect - Maintenance mode is ON');
    
    // Si l'utilisateur est admin, laisser passer sur toutes les pages admin
    if (user && user.role === 'admin' && isAdminPage) {
      console.log('MaintenanceRedirect - Admin user accessing admin page, allowing access');
      return <>{children}</>;
    }

    // Si c'est une page autorisée, laisser passer
    if (allowedPaths.some(path => path && location.pathname.startsWith(path))) {
      console.log('MaintenanceRedirect - Allowed path, allowing access');
      return <>{children}</>;
    }

    // Sinon, rediriger vers la page de maintenance
    console.log('MaintenanceRedirect - Redirecting to maintenance page');
    return <Navigate to="/maintenance" replace />;
  }

  // Mode maintenance désactivé, laisser passer
  console.log('MaintenanceRedirect - Maintenance mode is OFF, allowing access');
  return <>{children}</>;
};

export default MaintenanceRedirect;
