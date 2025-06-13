
import React from 'react';
import MigrationPanel from '@/components/admin/MigrationPanel';
import ExportPanel from '@/components/admin/ExportPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DataMigrationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestion des données
        </h1>
        <p className="text-gray-600">
          Migration et exportation des données entre le serveur JSON et Supabase
        </p>
      </div>
      
      <Tabs defaultValue="migration" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="migration">Migration des données</TabsTrigger>
          <TabsTrigger value="export">Exportation CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="migration" className="mt-8">
          <MigrationPanel />
        </TabsContent>
        
        <TabsContent value="export" className="mt-8">
          <ExportPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataMigrationPage;
