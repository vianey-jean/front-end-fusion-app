
import React from 'react';
import { BrowserRouter as Router, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { RealtimeWrapper } from '@/components/common/RealtimeWrapper';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import MessagesPage from '@/pages/MessagesPage';
import Produits from '@/pages/Produits';
import Ventes from '@/pages/Ventes';
import Depenses from '@/pages/Depenses';
import PretFamilles from '@/pages/PretFamilles';
import PretProduits from '@/pages/PretProduits';
import Comptabilite from '@/pages/Comptabilite';
import TendancesPage from '@/pages/TendancesPage';
import ClientsPage from '@/pages/ClientsPage';
import NotFound from '@/pages/NotFound';

// Create router avec les future flags
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/about",
    element: <AboutPage />
  },
  {
    path: "/contact",
    element: <ContactPage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/messages",
    element: (
      <ProtectedRoute>
        <MessagesPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/produits",
    element: (
      <ProtectedRoute>
        <Produits />
      </ProtectedRoute>
    )
  },
  {
    path: "/ventes",
    element: (
      <ProtectedRoute>
        <Ventes />
      </ProtectedRoute>
    )
  },
  {
    path: "/depenses",
    element: (
      <ProtectedRoute>
        <Depenses />
      </ProtectedRoute>
    )
  },
  {
    path: "/pret-familles",
    element: (
      <ProtectedRoute>
        <PretFamilles />
      </ProtectedRoute>
    )
  },
  {
    path: "/pret-produits",
    element: (
      <ProtectedRoute>
        <PretProduits />
      </ProtectedRoute>
    )
  },
  {
    path: "/comptabilite",
    element: (
      <ProtectedRoute>
        <Comptabilite />
      </ProtectedRoute>
    )
  },
  {
    path: "/tendances",
    element: (
      <ProtectedRoute>
        <TendancesPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/clients",
    element: (
      <ProtectedRoute>
        <ClientsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <NotFound />
  }
], {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true
  }
});

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <RealtimeWrapper>
            <RouterProvider router={router} />
            <Toaster />
          </RealtimeWrapper>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
