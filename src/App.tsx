
import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollToTop } from '@/utils/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import SecureRoute from '@/components/SecureRoute';
import { siteConfig } from '@/config/site';
import { Settings } from '@radix-ui/react-icons';
import { Icons } from '@/components/icons';

// Import des pages principales
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import PanierPage from '@/pages/PanierPage';
import ProfilePage from '@/pages/ProfilePage';
import OrdersPage from '@/pages/OrdersPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ReviewsPage from '@/pages/ReviewsPage';
import CodePromosPage from '@/pages/CodePromosPage';
import RemboursementsPage from '@/pages/RemboursementsPage';
import FlashSalePage from '@/pages/FlashSalePage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';
import AdminContactsPage from '@/pages/admin/AdminContactsPage';
import AdminChatPage from '@/pages/admin/AdminChatPage';
import AdminClientChatPage from '@/pages/admin/AdminClientChatPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminFlashSalesPage from '@/pages/admin/AdminFlashSalesPage';

// Import des autres pages
import NotFound from '@/pages/NotFound';
import ClientChatWidget from '@/components/chat/ClientChatWidget';

// Import du composant de chargement
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Composant de chargement pour Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <LoadingSpinner />
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();
  
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/flash-sale" element={<FlashSalePage />} />

        {/* Routes protégées */}
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/panier" element={
          <ProtectedRoute>
            <PanierPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        } />
        <Route path="/reviews" element={
          <ProtectedRoute>
            <ReviewsPage />
          </ProtectedRoute>
        } />
        <Route path="/code-promos" element={
          <ProtectedRoute>
            <CodePromosPage />
          </ProtectedRoute>
        } />
        <Route path="/remboursements" element={
          <ProtectedRoute>
            <RemboursementsPage />
          </ProtectedRoute>
        } />

        {/* Routes admin */}
        <Route path="/admin" element={
          <SecureRoute requiredRole="admin">
            <AdminLayout />
          </SecureRoute>
        }>
          <Route index element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="client-chat" element={<AdminClientChatPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="flash-sales" element={<AdminFlashSalesPage />} />
        </Route>

        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Chat widget pour les clients connectés */}
      {user && user.role !== 'admin' && <ClientChatWidget />}
    </>
  );
};

const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <AppRoutes />
    </Suspense>
  );
};

export default App;
