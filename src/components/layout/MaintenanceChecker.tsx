
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

interface MaintenanceCheckerProps {
  children: React.ReactNode;
}

const MaintenanceChecker: React.FC<MaintenanceCheckerProps> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkMaintenanceMode();
  }, []);

  const checkMaintenanceMode = async () => {
    try {
      // Utiliser la nouvelle route publique
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Chargement...</div>
      </div>
    );
  }

  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-orange-600">
              Mode Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert>
              <AlertDescription>
                Le site est actuellement en maintenance. Seuls les administrateurs peuvent se connecter.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/login')} className="w-full">
              Connexion Administrateur
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceChecker;
