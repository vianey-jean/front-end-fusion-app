
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Heart, 
  Menu, 
  X,
  Crown,
  Sparkles,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/theme-provider';
import AdvancedSearchBar from '@/components/search/AdvancedSearchBar';
import CategoriesDropdown from './CategoriesDropdown';
import { useCategories } from '@/hooks/useCategories';
import logo from '@/assets/logo.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount } = useCart();
  const { favoritesCount } = useFavorites();
  const { user, logout } = useAuth();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navVariants = {
    hidden: { y: -100 },
    visible: { y: 0 },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '-100%' },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: '-100%' }
  };

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className={`relative z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-lg border-b border-neutral-200/50 dark:border-neutral-800/50' 
            : 'bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800'
        }`}
      >
        {/* Premium Badge */}
        <div className="bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 text-white text-center py-1 text-xs font-medium">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="h-3 w-3" />
            <span>Boutique Premium - Livraison gratuite dès 50€</span>
            <Sparkles className="h-3 w-3" />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Riziky Boutique" 
                  className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full p-1">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                  Riziky Boutique
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Produits capillaires premium</p>
              </div>
            </Link>

            {/* Categories - Desktop */}
            <div className="hidden lg:block">
              <CategoriesDropdown categories={categories} />
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <AdvancedSearchBar />
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative group">
                <Bell className="h-5 w-5 group-hover:text-rose-500 transition-colors" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs">
                  3
                </Badge>
              </Button>

              {/* Favorites */}
              <Button variant="ghost" size="sm" asChild className="relative group">
                <Link to="/favoris">
                  <Heart className="h-5 w-5 group-hover:text-rose-500 transition-colors" />
                  {favoritesCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-gradient-to-r from-rose-500 to-purple-500 text-white text-xs">
                      {favoritesCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="sm" asChild className="relative group">
                <Link to="/panier">
                  <ShoppingCart className="h-5 w-5 group-hover:text-purple-500 transition-colors" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild className="group">
                    <Link to="/profil">
                      <User className="h-5 w-5 group-hover:text-amber-500 transition-colors" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={logout}
                    className="hidden md:inline-flex text-neutral-600 hover:text-red-500 transition-colors"
                  >
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild className="text-neutral-600 hover:text-purple-500 transition-colors">
                    <Link to="/connexion">Connexion</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600 text-white">
                    <Link to="/inscription">Inscription</Link>
                  </Button>
                </div>
              )}

              <ThemeToggle />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="md:hidden pb-4">
            <AdvancedSearchBar />
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-neutral-900 z-50 shadow-xl lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-rose-500 to-purple-500 p-2 rounded-xl">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
                      Menu
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                      Catégories
                    </h3>
                    <div className="space-y-2">
                      {categories.slice(0, 6).map(category => (
                        <Link
                          key={category.id}
                          to={`/categorie/${category.name}`}
                          className="block px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-rose-50 hover:to-purple-50 dark:hover:from-rose-950/20 dark:hover:to-purple-950/20 hover:text-rose-600 transition-all capitalize"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* User Actions */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                      Mon Compte
                    </h3>
                    <div className="space-y-2">
                      {user ? (
                        <>
                          <Link
                            to="/profil"
                            className="block px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-950/20 dark:hover:to-orange-950/20 hover:text-amber-600 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Mon Profil
                          </Link>
                          <Link
                            to="/commandes"
                            className="block px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/20 dark:hover:to-indigo-950/20 hover:text-blue-600 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Mes Commandes
                          </Link>
                          <button
                            onClick={() => {
                              logout();
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/20 dark:hover:to-pink-950/20 hover:text-red-600 transition-all"
                          >
                            Déconnexion
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/connexion"
                            className="block px-3 py-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/20 dark:hover:to-pink-950/20 hover:text-purple-600 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Connexion
                          </Link>
                          <Link
                            to="/inscription"
                            className="block px-3 py-2 rounded-lg bg-gradient-to-r from-rose-500 to-purple-500 text-white font-medium text-center"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Inscription
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
