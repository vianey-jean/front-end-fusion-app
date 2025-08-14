
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RealtimeWrapper from '@/components/common/RealtimeWrapper';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TendancesPage from './pages/TendancesPage';
import ClientsPage from './pages/ClientsPage';
import Produits from './pages/Produits';
import Ventes from './pages/Ventes';
import PretFamilles from './pages/PretFamilles';
import PretProduits from './pages/PretProduits';
import Depenses from './pages/Depenses';
import Contact from './pages/ContactPage';
import Apropos from './pages/AboutPage';
import HomePage from './pages/HomePage';
import TendancesPage from './pages/TendancesPage';
import Comptabilite from './pages/Comptabilite';
import MessagesPage from './pages/MessagesPage';
import NotFound from './pages/NotFound';
import '@/styles/accessibility.css';
import './App.css';

function App() {
  return (
    <AccessibilityProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <RealtimeWrapper>
              <Router
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <div className="min-h-screen bg-background">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<Apropos />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ResetPasswordPage />} />
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/messages" element={
                      <ProtectedRoute>
                        <MessagesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/produits" element={
                      <ProtectedRoute>
                        <Produits />
                      </ProtectedRoute>
                    } />
                    <Route path="/ventes" element={
                      <ProtectedRoute>
                        <Ventes />
                      </ProtectedRoute>
                    } />
                   
                    <Route path="/clients" element={
                      <ProtectedRoute>
                        <ClientsPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/pret-familles" element={
                      <ProtectedRoute>
                        <PretFamilles />
                      </ProtectedRoute>
                    } />
                    <Route path="/pret-produits" element={
                      <ProtectedRoute>
                        <PretProduits />
                      </ProtectedRoute>
                    } />
                    <Route path="/depenses" element={
                      <ProtectedRoute>
                        <Depenses />
                      </ProtectedRoute>
                    } />
                    <Route path="/tendances" element={
                      <ProtectedRoute>
                        <TendancesPage />
                      </ProtectedRoute>
                    } />
                    <Route path="/comptabilite" element={
                      <ProtectedRoute>
                        <Comptabilite />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
              </Router>
            </RealtimeWrapper>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </AccessibilityProvider>
  );
}

export default App;
