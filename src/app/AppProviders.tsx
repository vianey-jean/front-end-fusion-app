
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

// Configuration QueryClient optimisée pour Supabase
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnMount: 'always',
      networkMode: 'always'
    },
    mutations: {
      retry: 1,
      networkMode: 'always'
    }
  },
});

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          {children}
          <Toaster 
            closeButton 
            richColors 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                border: '1px solid #e5e7eb',
                color: '#374151'
              }
            }}
          />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
