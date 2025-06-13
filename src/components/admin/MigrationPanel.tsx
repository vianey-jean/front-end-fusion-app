
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { migrateAllDataToSupabase } from '@/services/supabaseApi';
import { Loader2, Database, Server, CheckCircle, RefreshCw } from 'lucide-react';

const MigrationPanel = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationResults, setMigrationResults] = useState<any>(null);

  const handleMigration = async () => {
    setIsMigrating(true);
    
    try {
      toast.info('🚀 Démarrage de la migration complète des données...');
      
      const result = await migrateAllDataToSupabase();
      
      toast.success('✅ Migration complète terminée avec succès!');
      setMigrationComplete(true);
      setMigrationResults(result.results);
      
      console.log('Migration result:', result);
    } catch (error) {
      console.error('Erreur de migration:', error);
      toast.error('❌ Erreur lors de la migration: ' + error.message);
    } finally {
      setIsMigrating(false);
    }
  };

  const resetMigration = () => {
    setMigrationComplete(false);
    setMigrationResults(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Migration complète vers Supabase
        </CardTitle>
        <CardDescription>
          Migrer toutes les données JSON du serveur vers Supabase et basculer vers une architecture 100% Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
          <Server className="h-5 w-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-900">Serveur source</p>
            <p className="text-sm text-blue-700">https://riziky-boutic-server.onrender.com</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium">Données à migrer:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Catégories</li>
              <li>• Produits</li>
              <li>• Contacts</li>
              <li>• Codes promos</li>
              <li>• Avis clients</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Fonctionnalités:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Publicités</li>
              <li>• Ventes flash</li>
              <li>• Statistiques visiteurs</li>
              <li>• Chat service client</li>
              <li>• Paramètres du site</li>
            </ul>
          </div>
        </div>

        {migrationComplete && migrationResults && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Migration terminée avec succès!</span>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h5 className="font-medium mb-2">Résultats de la migration:</h5>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>• Catégories: {migrationResults.categories}</div>
                <div>• Produits: {migrationResults.products}</div>
                <div>• Contacts: {migrationResults.contacts}</div>
                <div>• Codes promos: {migrationResults.code_promos}</div>
                <div>• Avis: {migrationResults.reviews}</div>
                <div>• Publicités: {migrationResults.pub_layout}</div>
                <div>• Ventes flash: {migrationResults.banniereflashsale}</div>
                <div>• Chat: {migrationResults.chat_conversations}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleMigration} 
            disabled={isMigrating}
            className="flex-1"
            size="lg"
          >
            {isMigrating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Migration en cours...
              </>
            ) : migrationComplete ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Migration terminée
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Démarrer la migration complète
              </>
            )}
          </Button>
          
          {migrationComplete && (
            <Button 
              onClick={resetMigration}
              variant="outline"
              size="lg"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs text-amber-700">
            <strong>Important:</strong> Cette migration va basculer l'application vers une architecture 100% Supabase. 
            Toutes les requêtes utiliseront désormais Supabase au lieu du serveur JSON.
          </p>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Cette opération peut prendre quelques minutes selon la quantité de données.
        </p>
      </CardContent>
    </Card>
  );
};

export default MigrationPanel;
