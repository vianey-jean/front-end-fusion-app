
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Heart, ShoppingBag, Star, Award, Crown, Sparkles } from 'lucide-react';
import { productsAPI } from '@/services/productsAPI';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';

const PopularityPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        setLoading(true);
        
        const response = await productsAPI.getMostFavorited();
        
        if (response.data && Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des produits populaires:', error);
        toast.error('Erreur lors du chargement des produits populaires');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const stats = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Les plus aimés",
      subtitle: "Par nos clients",
      color: "from-rose-500 to-pink-600",
      bgColor: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Tendances",
      subtitle: "Du moment",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
    },
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Best sellers",
      subtitle: "Incontournables",
      color: "from-amber-500 to-yellow-600",
      bgColor: "from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20"
    }
  ];

  const LoadingSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-purple-950/30">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-800 dark:via-pink-800 dark:to-rose-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-20 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-500"></div>
          </div>
          <div className="container mx-auto px-4 py-20 relative">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center mb-8"
              >
                <div className="relative">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl shadow-2xl">
                    <TrendingUp className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                Produits Populaires
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-purple-100 mb-12 leading-relaxed"
              >
                Découvrez les produits les plus appréciés par nos clients. 
                Sélectionnés selon leurs favoris et leurs achats, ces articles sont des incontournables de notre collection.
              </motion.p>
              
              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-4 shadow-lg`}>
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stat.title}</h3>
                    <p className="text-purple-100">{stat.subtitle}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-16">
          {products.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Award className="h-8 w-8 text-amber-500" />
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text text-transparent">
                    Nos Bestsellers
                  </h2>
                </div>
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  {products.length} produit{products.length > 1 ? 's' : ''} populaire{products.length > 1 ? 's' : ''}
                </p>
              </motion.div>

              {/* Featured badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center gap-4 mb-12"
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${stat.bgColor} rounded-full border border-neutral-200 dark:border-neutral-700`}
                  >
                    <div className={`text-transparent bg-gradient-to-r ${stat.color} bg-clip-text`}>
                      {React.cloneElement(stat.icon, { className: 'h-4 w-4' })}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {stat.title}
                    </span>
                  </div>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <ProductGrid products={products} />
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 border border-neutral-200 dark:border-neutral-700 max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-10 w-10 text-neutral-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                  Aucun produit populaire
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Les produits populaires apparaîtront ici une fois que nos clients commenceront à les ajouter à leurs favoris et à les acheter.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PopularityPage;
