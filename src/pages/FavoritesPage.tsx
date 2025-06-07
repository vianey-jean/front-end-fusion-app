
import React from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FavoritesPage = () => {
  const { favorites, loadingFavorites } = useStore();
  const { isAuthenticated } = useAuth();
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-rose-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-rose-950/30">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-4 rounded-2xl shadow-xl">
                  <Heart className="h-12 w-12 text-white fill-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Mes Favoris
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Retrouvez tous vos produits préférés en un seul endroit
            </p>
          </motion.div>
          
          {!isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-8 text-center border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-10 w-10 text-rose-500" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                  Connectez-vous pour voir vos favoris
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  Vous devez être connecté pour accéder à votre liste de favoris et sauvegarder vos produits préférés
                </p>
                <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/login" className="flex items-center gap-2">
                    Se connecter
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ) : loadingFavorites ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-neutral-200/50 dark:border-neutral-700/50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Chargement de vos favoris...
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                  Nous récupérons vos produits préférés
                </p>
              </div>
            </motion.div>
          ) : favorites.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-8">
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6 border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {favorites.length} produit{favorites.length > 1 ? 's' : ''} dans vos favoris
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Continuez à découvrir nos nouveautés et ajoutez plus de produits à votre wishlist
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <ProductGrid products={favorites} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 text-center border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="h-12 w-12 text-neutral-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  Votre liste de favoris est vide
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                  Découvrez notre collection et ajoutez des produits à vos favoris pour les retrouver facilement
                </p>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link to="/" className="flex items-center gap-2">
                    Explorer nos produits
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FavoritesPage;
