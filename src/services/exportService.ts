
import { supabase } from '@/integrations/supabase/client';

export const exportService = {
  exportTable: async (tableName: string) => {
    try {
      console.log(`Exportation de la table ${tableName}...`);
      
      // Utilisation de any pour éviter les erreurs de types strictes
      const { data, error } = await (supabase as any).from(tableName).select('*');
      
      if (error) {
        console.error(`Erreur lors de l'exportation de ${tableName}:`, error);
        return { success: false, error: error.message, count: 0 };
      }

      if (!data || data.length === 0) {
        return { success: true, count: 0 };
      }

      // Convertir les données en CSV
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map((row: any) => 
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return JSON.stringify(value).replace(/"/g, '""');
            return String(value).replace(/"/g, '""');
          }).map(val => `"${val}"`).join(',')
        )
      ].join('\n');

      // Télécharger le fichier
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${tableName}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return { success: true, count: data.length };
    } catch (error) {
      console.error(`Erreur d'exportation ${tableName}:`, error);
      return { success: false, error: error.message, count: 0 };
    }
  },

  exportAllData: async () => {
    const tables = [
      'categories',
      'products', 
      'contacts',
      'orders',
      'code_promos',
      'reviews',
      'profiles',
      'pub_layout',
      'flash_sales',
      'sales_notifications',
      'visitors',
      'site_settings',
      'chat_conversations',
      'favorites',
      'cart',
      'preferences'
    ];

    const results: any = {};

    for (const table of tables) {
      results[table] = await exportService.exportTable(table);
      // Petite pause entre les exportations
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }
};
