
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Settings, Shield, Lock, User, AlertTriangle, Wrench, Clock } from 'lucide-react';

interface MaintenanceCheckerProps {
  children: React.ReactNode;
}

const MaintenanceChecker: React.FC<MaintenanceCheckerProps> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/public-settings/general`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Paramètres maintenance récupérés:', data);
        setIsMaintenanceMode(data?.maintenanceMode || false);
      } else {
        console.error('Erreur API paramètres:', response.status, response.statusText);
        setIsMaintenanceMode(false);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du mode maintenance:', error);
      setIsMaintenanceMode(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    console.log('Redirection vers la page de connexion pour admin');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  const isLoginPage = location.pathname.includes('login') || location.pathname.includes('auth');
  const isAdminPage = location.pathname.includes('admin');

  if (isAuthenticated && isAdmin) {
    return <>{children}</>;
  }

  if (isMaintenanceMode && !isLoginPage && !isAdminPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 relative overflow-hidden">
        {/* Éléments décoratifs d'arrière-plan */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-40 h-40 bg-red-200/30 rounded-full blur-xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-200/20 rounded-full blur-2xl"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", damping: 20 }}
          className="relative z-10"
        >
          <Card className="w-[500px] bg-white/80 backdrop-blur-xl shadow-2xl border-2 border-orange-200 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white p-8 relative">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative flex items-center justify-center space-x-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-white/20 rounded-2xl p-4"
                >
                  <Wrench className="h-8 w-8" />
                </motion.div>
                <div>
                  <CardTitle className="text-3xl font-bold text-center mb-2">
                    🔧 Mode Maintenance
                  </CardTitle>
                  <p className="text-center text-orange-100 text-sm">
                    Amélioration en cours...
                  </p>
                </div>
              </div>
              
              {/* Éléments décoratifs */}
              <div className="absolute top-4 right-6 opacity-40">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Settings className="h-6 w-6" />
                </motion.div>
              </div>
              <div className="absolute bottom-4 left-6 opacity-30">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Clock className="h-5 w-5" />
                </motion.div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Alert className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <AlertDescription className="text-orange-800 font-medium">
                      Le site est actuellement en maintenance. Seuls les administrateurs peuvent se connecter.
                    </AlertDescription>
                  </div>
                </Alert>
              </motion.div>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">Accès administrateur</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Connectez-vous avec vos identifiants administrateur pour accéder au site
                  </p>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    onClick={handleAdminLogin} 
                    className="w-full h-14 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold text-lg shadow-lg border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5" />
                      <span>Connexion Administrateur</span>
                      <Lock className="h-4 w-4" />
                    </div>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                className="text-center space-y-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-sm text-gray-500">
                  Maintenance estimée : <span className="font-semibold text-orange-600">En cours</span>
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                  <Clock className="h-3 w-3" />
                  <span>Merci de votre patience</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceChecker;
