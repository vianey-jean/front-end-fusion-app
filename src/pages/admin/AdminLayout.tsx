
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag,
  Package,
  MessageCircle,
  Users,
  Truck,
  Settings,
  LogOut,
  Percent,
  MessageSquare,
  Megaphone,
  RefreshCw,
  Zap,
  FolderOpen,
  Menu,
  X,
  BarChart3,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureRoute } from '@/services/secureIds';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isServiceAdmin, setIsServiceAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (user && user.email === "service.client@example.com") {
      setIsServiceAdmin(true);
    }
  }, [user]);
  
  const secureRoutes = {
    produits: getSecureRoute('/admin/produits'),
    utilisateurs: getSecureRoute('/admin/utilisateurs'),
    messages: getSecureRoute('/admin/messages'),
    commandes: getSecureRoute('/admin/commandes'),
    chat: getSecureRoute('/admin'),
    serviceClient: getSecureRoute('/admin/service-client'),
    codePromo: getSecureRoute('/admin/code-promos'),
    parametres: getSecureRoute('/admin/parametres'),
    pubLayout: getSecureRoute('/admin/pub-layout'),
    remboursements: getSecureRoute('/admin/remboursements'),
    flashSales: getSecureRoute('/admin/flash-sales'),
    categories: getSecureRoute('/admin/categories'),
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      path: secureRoutes.chat, 
      realPath: '/admin', 
      icon: BarChart3, 
      color: 'from-blue-500 to-blue-600',
      description: 'Vue d\'ensemble'
    },
    { 
      name: 'Produits', 
      path: secureRoutes.produits, 
      realPath: '/admin/produits', 
      icon: Package, 
      color: 'from-emerald-500 to-emerald-600',
      description: 'Gestion du catalogue'
    },
    { 
      name: 'Catégories', 
      path: secureRoutes.categories, 
      realPath: '/admin/categories', 
      icon: FolderOpen, 
      color: 'from-purple-500 to-purple-600',
      description: 'Organisation produits'
    },
    { 
      name: 'Commandes', 
      path: secureRoutes.commandes, 
      realPath: '/admin/commandes', 
      icon: Truck, 
      color: 'from-indigo-500 to-indigo-600',
      description: 'Suivi des ventes'
    },
    { 
      name: 'Utilisateurs', 
      path: secureRoutes.utilisateurs, 
      realPath: '/admin/utilisateurs', 
      icon: Users, 
      color: 'from-green-500 to-green-600',
      description: 'Gestion clients'
    },
    { 
      name: 'Messages', 
      path: secureRoutes.messages, 
      realPath: '/admin/messages', 
      icon: MessageCircle, 
      color: 'from-yellow-500 to-orange-500',
      description: 'Communication'
    },
    { 
      name: 'Promotions', 
      path: secureRoutes.codePromo, 
      realPath: '/admin/code-promos', 
      icon: Percent, 
      color: 'from-pink-500 to-rose-500',
      description: 'Codes promo'
    },
    { 
      name: 'Ventes Flash', 
      path: secureRoutes.flashSales, 
      realPath: '/admin/flash-sales', 
      icon: Zap, 
      color: 'from-amber-500 to-yellow-500',
      description: 'Offres limitées'
    },
    { 
      name: 'Publicités', 
      path: secureRoutes.pubLayout, 
      realPath: '/admin/pub-layout', 
      icon: Megaphone, 
      color: 'from-cyan-500 to-cyan-600',
      description: 'Bannières & annonces'
    },
    { 
      name: 'Remboursements', 
      path: secureRoutes.remboursements, 
      realPath: '/admin/remboursements', 
      icon: RefreshCw, 
      color: 'from-red-500 to-red-600',
      description: 'Gestion retours'
    },
    ...(isServiceAdmin ? [{ 
      name: 'Service Client', 
      path: secureRoutes.serviceClient, 
      realPath: '/admin/service-client',
      icon: MessageSquare,
      color: 'from-teal-500 to-teal-600',
      description: 'Support client'
    }] : []),
    { 
      name: 'Paramètres', 
      path: secureRoutes.parametres, 
      realPath: '/admin/parametres', 
      icon: Settings, 
      color: 'from-gray-500 to-gray-600',
      description: 'Configuration'
    },
  ];

  const isActivePath = (realPath: string) => {
    return location.pathname === realPath || location.pathname.startsWith(realPath + '/');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-red-800 via-red-700 to-red-800 shadow-2xl border-b border-red-600/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-2xl shadow-lg">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Riziky Boutique</h1>
              <p className="text-xs text-red-100">Panneau d'administration</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            {sidebarOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-30 w-full md:w-80 bg-gradient-to-b from-red-900 via-red-800 to-red-900 text-white md:min-h-screen transition-all duration-300 ease-in-out shadow-2xl`}>
        
        {/* Desktop Header */}
        <div className="hidden md:block p-8 border-b border-red-700/30 bg-gradient-to-r from-red-800/50 to-red-700/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-3xl shadow-lg">
              <ShoppingBag className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Riziky Boutique
              </h1>
              <p className="text-red-200 text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Administration Premium
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="p-4 space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin scrollbar-thumb-red-600/50 scrollbar-track-transparent">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-4 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                isActivePath(item.realPath)
                  ? 'bg-white/20 text-white shadow-lg scale-[1.02] backdrop-blur-sm'
                  : 'text-red-100 hover:bg-white/10 hover:text-white hover:backdrop-blur-sm'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${
                isActivePath(item.realPath) 
                  ? 'bg-white/30 shadow-lg scale-110' 
                  : `bg-gradient-to-r ${item.color} opacity-80 group-hover:opacity-100 group-hover:scale-105`
              }`}>
                <item.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="font-semibold text-sm">{item.name}</span>
                <p className="text-xs text-red-200/80 group-hover:text-red-100 transition-colors">
                  {item.description}
                </p>
              </div>
              {isActivePath(item.realPath) && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </Link>
          ))}
        </div>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-700/30 bg-gradient-to-r from-red-800/50 to-red-700/50 backdrop-blur-sm">
          <Link 
            to="/" 
            className="flex items-center px-4 py-3 text-red-100 rounded-2xl hover:bg-white/10 hover:text-white transition-all duration-300 group hover:backdrop-blur-sm"
          >
            <div className="p-3 rounded-xl mr-4 bg-gradient-to-r from-red-600/50 to-red-500/50 group-hover:from-white/20 group-hover:to-white/20 transition-all duration-300">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <span className="font-semibold text-sm">Retour au site</span>
              <p className="text-xs text-red-200/80">Interface client</p>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 min-h-[calc(100vh-4rem)] p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
