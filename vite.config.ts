
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@emoji-mart/data': path.resolve(__dirname, 'node_modules/@emoji-mart/data'),
      '@emoji-mart/react': path.resolve(__dirname, 'node_modules/@emoji-mart/react')
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'emoji-mart': ['@emoji-mart/data', '@emoji-mart/react'],
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
            'framer-motion',
            'lucide-react',
            'recharts'
          ],
          'ui': [
            '@/components/ui'
          ]
        }
      },
      external: []
    },
    chunkSizeWarningLimit: 1000, // Augmenter la limite d'avertissement pour les gros chunks
    sourcemap: false, // Désactiver les sourcemaps en production pour réduire la taille
    minify: 'terser', // Utiliser terser pour une meilleure minification
    terserOptions: {
      compress: {
        drop_console: true, // Supprimer les console.log en production
      },
    },
  },
  server: {
    port: 8080,
  },
});
