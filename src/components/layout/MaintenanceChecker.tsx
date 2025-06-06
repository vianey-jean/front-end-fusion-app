
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Clock, Shield } from 'lucide-react';

interface MaintenanceCheckerProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

const MaintenanceChecker: React.FC<MaintenanceCheckerProps> = ({ children, isAdmin = false }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-settings/general`);
        if (response.ok) {
          const data = await response.json();
          setIsMaintenanceMode(data?.maintenanceMode || false);
        } else {
          setIsMaintenanceMode(false);
        }
      } catch (error) {
        console.error('Erreur vérification mode maintenance:', error);
        setIsMaintenanceMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceMode();
  }, []);

  // Affichage du loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400 border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold mb-2">Vérification du système...</h2>
          <p className="text-blue-200">Connexion en cours...</p>
        </motion.div>
      </div>
    );
  }

  // Si mode maintenance activé ET utilisateur n'est pas admin
  if (isMaintenanceMode && !isAdmin) {
    // Afficher la page de maintenance
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center text-white"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-8"
          >
            <Wrench className="h-20 w-20 text-blue-400 mx-auto" />
          </motion.div>

          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Maintenance en cours
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Notre site est temporairement en maintenance pour vous offrir une meilleure expérience.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="text-blue-200">Durée estimée</span>
            </div>
            <p className="text-2xl font-bold text-white">Quelques minutes</p>
          </div>

          <div className="text-sm text-gray-400 space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span>Vos données sont en sécurité</span>
            </div>
            <p>Merci de votre patience</p>
          </div>

          {/* Lien de connexion admin */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8"
          >
            <a
              href="/maintenance-admin-login"
              className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <Shield className="h-4 w-4" />
              <span>Accès administrateur</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Mode normal ou admin connecté en mode maintenance - afficher le contenu
  return <>{children}</>;
};

export default MaintenanceChecker;
