
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { maintenanceAPI } from '@/services/maintenanceAPI';
import { Wrench, Clock, Mail, Phone, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getSecureRoute } from '@/services/secureIds';

const MaintenancePage = () => {
  const navigate = useNavigate();
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  const { data: maintenanceData } = useQuery({
    queryKey: ['maintenance'],
    queryFn: maintenanceAPI.getMaintenanceStatus,
    staleTime: 5000,
    refetchInterval: 10000,
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Wrench className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Riziky-Boutic
          </h1>
          <div className="w-12 h-1 bg-blue-600 mx-auto mb-4"></div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Site en maintenance
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {maintenanceData?.description || 
             'Notre site est actuellement en maintenance. Nous travaillons pour améliorer votre expérience et reviendrons bientôt avec de nouvelles fonctionnalités !'}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-2" />
            Nous reviendrons très prochainement
          </div>
        </div>

        {/* Accès administrateur */}
        <div className="mb-6">
          {!showAdminAccess ? (
            <Button 
              variant="outline" 
              onClick={() => setShowAdminAccess(true)}
              className="text-sm"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Accès administrateur
            </Button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Connexion administrateur disponible</p>
              <Button 
                onClick={() => navigate(getSecureRoute('/login') || '/login')}
                className="w-full"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Se connecter en tant qu'admin
              </Button>
            </div>
          )}
        </div>

        <div className="border-t pt-6 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Besoin d'aide ? Contactez-nous :
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-center text-sm text-blue-600">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:contact@riziky-boutic.com" className="hover:underline">
                contact@riziky-boutic.com
              </a>
            </div>
            <div className="flex items-center justify-center text-sm text-blue-600">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:+33123456789" className="hover:underline">
                +33 1 23 45 67 89
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-400">
            <span>Powered by</span>
            <span className="font-semibold">Riziky-Boutic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
