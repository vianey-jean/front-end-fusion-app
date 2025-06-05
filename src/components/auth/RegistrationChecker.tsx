
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { settingsAPI } from '@/services/settingsAPI';

interface RegistrationCheckerProps {
  children: React.ReactNode;
}

const RegistrationChecker: React.FC<RegistrationCheckerProps> = ({ children }) => {
  const [registrationAllowed, setRegistrationAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRegistrationStatus();
  }, []);

  const checkRegistrationStatus = async () => {
    try {
      const response = await settingsAPI.getGeneralSettings();
      setRegistrationAllowed(response.data?.allowRegistration || false);
    } catch (error) {
      console.error('Erreur lors de la vérification des inscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!registrationAllowed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">
              Inscriptions Fermées
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert>
              <AlertDescription>
                Les nouvelles inscriptions sont actuellement fermées. 
                Veuillez contacter l'administrateur pour plus d'informations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default RegistrationChecker;
