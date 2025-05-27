
// Polyfill pour global - approche plus robuste
if (typeof global === 'undefined') {
  (window as any).global = window;
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { StoreProvider } from '@/contexts/StoreContext'
import CookieManager from './components/prompts/CookieManager'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <App />
              <CookieManager position="fixed" />
              <Toaster />
            </ThemeProvider>
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
