
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStore } from '@/contexts/StoreContext';
import { ScrollToTop } from '@/utils/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { DashboardIcon, ImageIcon, SettingsIcon } from "@radix-ui/react-icons"
import { Icons } from "@/components/icons"

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage';
import CategoryPage from '@/pages/CategoryPage';
import ProfilePage from '@/pages/ProfilePage';
import PanierPage from '@/pages/PanierPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ContactPage from '@/pages/ContactPage';
import OrdersPage from '@/pages/OrdersPage';
import ReviewsPage from '@/pages/ReviewsPage';
import CodePromosPage from '@/pages/CodePromosPage';
import RemboursementsPage from '@/pages/RemboursementsPage';

import AdminLayoutComponent from '@/pages/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminReviewsPage from '@/pages/admin/AdminReviewsPage';
import AdminContactsPage from '@/pages/admin/AdminContactsPage';
import AdminCodePromosPage from '@/pages/admin/AdminCodePromosPage';
import AdminRemboursementsPage from '@/pages/admin/AdminRemboursementsPage';
import AdminChatPage from '@/pages/admin/AdminChatPage';
import AdminPubLayoutPage from '@/pages/admin/AdminPubLayoutPage';

import ClientChatWidget from '@/components/chat/ClientChatWidget';
import FlashSalePage from '@/pages/FlashSalePage';
import AdminFlashSalesPage from '@/pages/admin/AdminFlashSalesPage';

interface SecureRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

const SecureRoute: React.FC<SecureRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      console.warn('Accès non autorisé : utilisateur non authentifié');
    } else if (requiredRole === 'admin' && user?.role !== 'admin') {
      console.warn('Accès non autorisé : rôle admin requis');
    }
  }, [isAuthenticated, user, requiredRole]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-900">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700">
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-neutral-700">
          <Link to="/" className="text-2xl font-bold text-red-600">
            {siteConfig.name}
          </Link>
        </div>
        <nav className="space-y-2">
          <Link
            to="/admin"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <DashboardIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/products"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname.startsWith('/admin/products')
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <ImageIcon className="h-5 w-5" />
            <span>Products</span>
          </Link>
          <Link
            to="/admin/orders"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/orders'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.order className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/users'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.user className="h-5 w-5" />
            <span>Users</span>
          </Link>
          <Link
            to="/admin/reviews"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/reviews'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.review className="h-5 w-5" />
            <span>Reviews</span>
          </Link>
          <Link
            to="/admin/contacts"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/contacts'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.contact className="h-5 w-5" />
            <span>Contacts</span>
          </Link>
          <Link
            to="/admin/code-promos"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/code-promos'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.codePromo className="h-5 w-5" />
            <span>Code Promos</span>
          </Link>
          <Link
            to="/admin/remboursements"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/remboursements'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.remboursement className="h-5 w-5" />
            <span>Remboursements</span>
          </Link>
          <Link
            to="/admin/chat"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/chat'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.chat className="h-5 w-5" />
            <span>Chat</span>
          </Link>
          <Link
            to="/admin/pub-layout"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/pub-layout'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.pubLayout className="h-5 w-5" />
            <span>Publicités</span>
          </Link>
          
          <Link
            to="/admin/flash-sales"
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === '/admin/flash-sales'
                ? 'bg-red-100 text-red-900'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-700'
            }`}
          >
            <Icons.flame className="h-5 w-5" />
            <span>Flash Sales</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="contacts" element={<AdminContactsPage />} />
          <Route path="code-promos" element={<AdminCodePromosPage />} />
          <Route path="remboursements" element={<AdminRemboursementsPage />} />
          <Route path="chat" element={<AdminChatPage />} />
          <Route path="pub-layout" element={<AdminPubLayoutPage />} />
          <Route path="flash-sales" element={<AdminFlashSalesPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
      <Router>
        <ScrollToTop />
        <AppRoutes />
        <Toaster />
        <ClientChatWidget />
      </Router>
    </ThemeProvider>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/product/:id" element={<ProductDetailsPage />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
      <Route path="/profile" element={<SecureRoute><ProfilePage /></SecureRoute>} />
      <Route path="/panier" element={<SecureRoute><PanierPage /></SecureRoute>} />
      <Route path="/favorites" element={<SecureRoute><FavoritesPage /></SecureRoute>} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/orders" element={<SecureRoute><OrdersPage /></SecureRoute>} />
      <Route path="/reviews" element={<SecureRoute><ReviewsPage /></SecureRoute>} />
      <Route path="/code-promos" element={<SecureRoute><CodePromosPage /></SecureRoute>} />
      <Route path="/remboursements" element={<SecureRoute><RemboursementsPage /></SecureRoute>} />
      
      {/* Flash Sale routes */}
      <Route path="/flash-sale/:id" element={<FlashSalePage />} />
      
      {/* Admin routes */}
      <Route 
        path="/admin/*" 
        element={
          <SecureRoute requiredRole="admin">
            <AdminLayout />
          </SecureRoute>
        } 
      />
      
      {/* Route par défaut - redirige vers la page d'accueil */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
