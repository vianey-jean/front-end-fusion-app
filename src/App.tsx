
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StoreProvider } from '@/contexts/StoreContext';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import AllProductsPage from '@/pages/AllProductsPage';
import PromotionalProductsPage from '@/pages/PromotionalProductsPage';
import NewArrivalsPage from '@/pages/NewArrivalsPage';
import ProductDetail from '@/pages/ProductDetail';
import CategoryPage from '@/pages/CategoryPage';
import CartPage from '@/pages/CartPage';
import FavoritesPage from '@/pages/FavoritesPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderPage from '@/pages/OrderPage';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ContactPage from '@/pages/ContactPage';
import FAQPage from '@/pages/FAQPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import CookiesPage from '@/pages/CookiesPage';
import MentionsLegalesPage from '@/pages/MentionsLegalesPage';
import DeliveryPage from '@/pages/DeliveryPage';
import ReturnsPage from '@/pages/ReturnsPage';
import CarriersPage from '@/pages/CarriersPage';
import BlogPage from '@/pages/BlogPage';
import ChatPage from '@/pages/ChatPage';
import CustomerServicePage from '@/pages/CustomerServicePage';
import HistoryPage from '@/pages/HistoryPage';
import FlashSalePage from '@/pages/FlashSalePage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import SecureRoute from '@/components/SecureRoute';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminChatPage from '@/pages/admin/AdminChatPage';
import AdminClientChatPage from '@/pages/admin/AdminClientChatPage';
import AdminPromoCodesPage from '@/pages/admin/AdminPromoCodesPage';
import AdminCodePromosPage from '@/pages/admin/AdminCodePromosPage';
import AdminPubLayoutPage from '@/pages/admin/AdminPubLayoutPage';
import AdminRefundsPage from '@/pages/admin/AdminRefundsPage';
import AdminRemboursementsPage from '@/pages/admin/AdminRemboursementsPage';
import AdminFlashSalesPage from '@/pages/admin/AdminFlashSalesPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import { VideoCallProvider } from '@/contexts/VideoCallContext';
import { FlashSaleRoutes } from '@/components/routing/FlashSaleRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <VideoCallProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tous-les-produits" element={<AllProductsPage />} />
              <Route path="/promotions" element={<PromotionalProductsPage />} />
              <Route path="/nouveautes" element={<NewArrivalsPage />} />
              <Route path="/produits" element={<AllProductsPage />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/categorie/:categoryName" element={<CategoryPage />} />
              <Route path="/panier" element={<CartPage />} />
              <Route path="/favoris" element={<FavoritesPage />} />
              
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              
              <Route path="/commandes" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              
              <Route path="/commande/:id" element={
                <ProtectedRoute>
                  <OrderPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profil" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/historique" element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              } />
              
              <Route path="/connexion" element={<LoginPage />} />
              <Route path="/inscription" element={<RegisterPage />} />
              <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/conditions-generales" element={<TermsPage />} />
              <Route path="/politique-confidentialite" element={<PrivacyPage />} />
              <Route path="/politique-cookies" element={<CookiesPage />} />
              <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
              <Route path="/livraison" element={<DeliveryPage />} />
              <Route path="/retours" element={<ReturnsPage />} />
              <Route path="/transporteurs" element={<CarriersPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/service-client" element={<CustomerServicePage />} />
              
              <Route path="/flash-sale/*" element={<FlashSaleRoutes />} />
              
              <Route path="/admin/*" element={
                <SecureRoute requiredRole="admin">
                  <AdminLayout>
                    <Routes>
                      <Route path="produits" element={<AdminProductsPage />} />
                      <Route path="commandes" element={<AdminOrdersPage />} />
                      <Route path="utilisateurs" element={<AdminUsersPage />} />
                      <Route path="messages" element={<AdminMessagesPage />} />
                      <Route path="parametres" element={<AdminSettingsPage />} />
                      <Route path="chat" element={<AdminChatPage />} />
                      <Route path="chat-client" element={<AdminClientChatPage />} />
                      <Route path="codes-promo" element={<AdminPromoCodesPage />} />
                      <Route path="code-promos" element={<AdminCodePromosPage />} />
                      <Route path="pub-layout" element={<AdminPubLayoutPage />} />
                      <Route path="remboursements" element={<AdminRefundsPage />} />
                      <Route path="refunds" element={<AdminRemboursementsPage />} />
                      <Route path="flash-sales" element={<AdminFlashSalesPage />} />
                      <Route path="categories" element={<AdminCategoriesPage />} />
                    </Routes>
                  </AdminLayout>
                </SecureRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </VideoCallProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
