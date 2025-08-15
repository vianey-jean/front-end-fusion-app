
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Toaster } from '@/components/ui/toaster';
import { RealtimeWrapper } from '@/components/common/RealtimeWrapper';
import Layout from '@/components/Layout';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import DashboardPage from '@/pages/DashboardPage';
import TendancesPage from '@/pages/TendancesPage';
import ClientsPage from '@/pages/ClientsPage';
import MessagesPage from '@/pages/MessagesPage';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <AppProvider>
              <Router>
                <Routes>
                  {/* Routes publiques */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                  </Route>

                  {/* Routes protégées */}
                  <Route path="/" element={<Layout requireAuth />}>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="tendances" element={<TendancesPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="messages" element={<MessagesPage />} />
                  </Route>

                  {/* Route 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
              <Toaster />
            </AppProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
