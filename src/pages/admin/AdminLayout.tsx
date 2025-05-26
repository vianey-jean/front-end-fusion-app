
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import AdminServiceChatWidget from '@/components/admin/AdminServiceChatWidget';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Tag,
  Settings,
  LogOut,
  Menu,
  X,
  Gift,
  Megaphone,
  MessageCircle,
  RefreshCw
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/admin' },
    { icon: Package, label: 'Produits', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Commandes', path: '/admin/orders' },
    { icon: Users, label: 'Utilisateurs', path: '/admin/users' },
    { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
    { icon: MessageCircle, label: 'Chat Admin', path: '/admin/chat' },
    { icon: MessageCircle, label: 'Service Client', path: '/admin/client-chat' },
    { icon: Tag, label: 'Codes Promo', path: '/admin/code-promos' },
    { icon: Gift, label: 'Codes de Réduction', path: '/admin/promo-codes' },
    { icon: Megaphone, label: 'Pub Layout', path: '/admin/pub-layout' },
    { icon: RefreshCw, label: 'Remboursements', path: '/admin/remboursements' },
    { icon: Settings, label: 'Paramètres', path: '/admin/settings' },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">R</span>
          </div>
          <span className="text-xl font-bold text-red-800">Riziky Admin</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 ${
                  isActive ? 'bg-red-50 text-red-800 border-l-4 border-red-800' : ''
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="mb-4 text-xs text-gray-500">
          Connecté en tant que: {user?.email}
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0`}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="border-b bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="lg:hidden">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-red-800 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <span className="font-bold text-red-800">Riziky Admin</span>
              </Link>
            </div>

            <div className="hidden lg:block">
              <h1 className="text-2xl font-semibold text-gray-800">
                Administration
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.nom} {user?.prenom}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Card className="min-h-[calc(100vh-12rem)]">
            <div className="p-6">
              {children}
            </div>
          </Card>
        </main>
      </div>

      {/* Widget de chat service client pour admin */}
      <AdminServiceChatWidget />
    </div>
  );
};

export default AdminLayout;
