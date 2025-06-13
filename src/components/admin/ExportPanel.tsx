
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { exportService } from '@/services/exportService';
import { Loader2, Download, FileText, CheckCircle, X } from 'lucide-react';

const ExportPanel = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportResults, setExportResults] = useState<any>(null);

  const handleExportAll = async () => {
    setIsExporting(true);
    setExportResults(null);
    
    try {
      toast.info('📥 Démarrage de l\'exportation des données...');
      
      const results = await exportService.exportAllData();
      
      setExportResults(results);
      
      const totalSuccess = Object.values(results).filter((r: any) => r.success).length;
      const totalFailed = Object.values(results).filter((r: any) => !r.success).length;
      
      if (totalFailed === 0) {
        toast.success(`✅ Exportation terminée! ${totalSuccess} tables exportées avec succès.`);
      } else {
        toast.warning(`⚠️ Exportation terminée avec ${totalFailed} erreur(s) sur ${Object.keys(results).length} tables.`);
      }
    } catch (error) {
      console.error('Erreur d\'exportation:', error);
      toast.error('❌ Erreur lors de l\'exportation: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportTable = async (tableName: string) => {
    try {
      toast.info(`📥 Exportation de ${tableName}...`);
      
      const result = await exportService.exportTable(tableName);
      
      if (result.success) {
        toast.success(`✅ ${tableName}.csv exporté avec succès (${result.count} entrées)`);
      } else {
        toast.error(`❌ Erreur lors de l'exportation de ${tableName}: ${result.error}`);
      }
    } catch (error) {
      console.error(`Erreur d'exportation ${tableName}:`, error);
      toast.error(`❌ Erreur lors de l'exportation de ${tableName}: ` + error.message);
    }
  };

  const tables = [
    { name: 'categories', label: 'Catégories' },
    { name: 'products', label: 'Produits' },
    { name: 'contacts', label: 'Contacts' },
    { name: 'orders', label: 'Commandes' },
    { name: 'code_promos', label: 'Codes Promos' },
    { name: 'reviews', label: 'Avis' },
    { name: 'profiles', label: 'Profils Utilisateurs' },
    { name: 'pub_layout', label: 'Publicités' },
    { name: 'flash_sales', label: 'Ventes Flash' },
    { name: 'sales_notifications', label: 'Notifications de Vente' }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportation des données en CSV
        </CardTitle>
        <CardDescription>
          Téléchargez toutes vos données Supabase au format CSV pour sauvegarde ou analyse
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Exportation globale */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-blue-900">Exportation complète</h4>
              <p className="text-sm text-blue-700">Télécharger toutes les tables en une fois</p>
            </div>
            <Button 
              onClick={handleExportAll} 
              disabled={isExporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exportation...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Tout exporter
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Résultats d'exportation */}
        {exportResults && (
          <div className="space-y-2">
            <h4 className="font-medium">Résultats de l'exportation :</h4>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {Object.entries(exportResults).map(([tableName, result]: [string, any]) => (
                <div key={tableName} className={`flex items-center gap-2 p-2 rounded text-sm ${
                  result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span>{tableName}: {result.count} entrées</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exportation par table */}
        <div className="space-y-4">
          <h4 className="font-medium">Exportation par table :</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tables.map((table) => (
              <div key={table.name} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">{table.label}</span>
                  <span className="text-xs text-gray-500">({table.name}.csv)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportTable(table.name)}
                  disabled={isExporting}
                >
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <p><strong>📝 Note :</strong> Les fichiers CSV seront téléchargés automatiquement dans votre dossier de téléchargements.</p>
          <p><strong>🔒 Sécurité :</strong> L'exportation respecte les politiques RLS de Supabase.</p>
          <p><strong>📊 Format :</strong> Les données JSON complexes sont converties en chaînes JSON dans le CSV.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
