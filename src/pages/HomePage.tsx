
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCatalogGrid from '@/components/products/ProductGrid';
import CustomerTestimonialSection from '@/components/reviews/TestimonialSection';
import DataRetryLoader from '@/components/data-loading/DataRetryLoader';
import HomeHeader from '@/components/home/HomeHeader';
import FeaturedProductsCarousel from '@/components/home/FeaturedProductsCarousel';
import PromotionalProductsGrid from '@/components/home/PromotionalProductsGrid';
import FlashSaleBanner from '@/components/flash-sale/FlashSaleBanner';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useCarouselAutoplay } from '@/hooks/useCarouselAutoplay';
import SalesNotification from '@/components/engagement/SalesNotification';
import LiveVisitorCounter from '@/components/engagement/LiveVisitorCounter';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Star, Gift } from 'lucide-react';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const {
    featuredProductCatalog,
    newArrivalProducts,
    promotionalProducts,
    completeProductCatalog,
    filteredProductCatalog,
    dataLoadingComplete,
    setFilteredProductCatalog,
    loadEcommerceProductData,
    handleDataLoadingSuccess,
    handleMaxRetriesReached
  } = useHomePageData();

  useCarouselAutoplay(!searchParams.get('q'), dataLoadingComplete, featuredProductCatalog.length);

  React.useEffect(() => {
    const searchQuery = searchParams.get('q');
    
    if (searchQuery && searchQuery.length >= 3) {
      const filteredResults = completeProductCatalog.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProductCatalog(filteredResults);
    } else {
      setFilteredProductCatalog(completeProductCatalog);
    }
  }, [searchParams, completeProductCatalog, setFilteredProductCatalog]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-rose-950/20">
        
        {/* Hero Section améliorée */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-100 via-orange-50 to-amber-100 dark:from-rose-950/50 dark:via-orange-950/50 dark:to-amber-950/50">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Sparkles className="h-4 w-4" />
                Nouvelle Collection Automne
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-6 leading-tight">
                Style & Élégance
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Découvrez notre collection exclusive de produits de beauté et d'accessoires de mode
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all duration-300"
                >
                  Explorer la Collection
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Voir les Promotions
                </motion.button>
              </div>
            </motion.div>
          </div>
          
          {/* Éléments décoratifs flottants */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-rose-400 to-orange-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full opacity-10 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <DataRetryLoader
            fetchFunction={loadEcommerceProductData}
            onSuccess={handleDataLoadingSuccess}
            onMaxRetriesReached={handleMaxRetriesReached}
            maxRetries={6}
            retryInterval={5000}
            errorMessage="Erreur de chargement des produits"
            loadingComponent={
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl p-16 max-w-lg mx-auto border border-rose-200/50 dark:border-rose-800/50 shadow-2xl">
                  <div className="relative mb-8">
                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-rose-200 border-t-rose-500 mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-rose-400 animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Préparation de votre boutique...
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Chargement de nos plus beaux produits
                  </p>
                </div>
              </motion.div>
            }
          >
            {/* Section de recherche */}
            {searchParams.get('q') && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
              >
                <div className="bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 rounded-2xl p-8 border border-rose-200/50 dark:border-rose-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      Résultats pour "{searchParams.get('q')}"
                    </h2>
                  </div>
                  <ProductCatalogGrid
                    products={filteredProductCatalog}
                    title=""
                  />
                </div>
              </motion.div>
            )}

            {/* Flash Sale Banner avec amélioration */}
            {!searchParams.get('q') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-16"
              >
                <FlashSaleBanner />
              </motion.div>
            )}

            {/* Produits vedettes avec nouveau design */}
            {!searchParams.get('q') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-16"
              >
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 text-amber-700 dark:text-amber-300 px-6 py-2 rounded-full text-sm font-medium mb-4">
                    <Star className="h-4 w-4" />
                    Sélection Premium
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4">
                    Nos Coups de Cœur
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Découvrez notre sélection exclusive des produits les plus populaires
                  </p>
                </div>
                <FeaturedProductsCarousel products={featuredProductCatalog} />
              </motion.div>
            )}

            {/* Produits promotionnels avec design amélioré */}
            {!searchParams.get('q') && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-16" 
                data-section="promotional"
              >
                <div className="bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 dark:from-red-950/30 dark:via-rose-950/30 dark:to-pink-950/30 rounded-3xl p-8 border border-red-200/50 dark:border-red-800/50">
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4 shadow-lg">
                      <Gift className="h-4 w-4" />
                      Offres Exceptionnelles
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-4">
                      Promotions du Moment
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                      Profitez de nos prix réduits sur une sélection de produits
                    </p>
                  </div>
                  <PromotionalProductsGrid products={promotionalProducts} />
                </div>
              </motion.div>
            )}

            {/* Nouveautés avec design moderne */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-16" 
              data-section="new-arrivals"
            >
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30 rounded-3xl p-8 border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-medium mb-4 shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    Tout Nouveau
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    Dernières Nouveautés
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Soyez les premiers à découvrir nos derniers arrivages
                  </p>
                </div>
                <ProductCatalogGrid products={newArrivalProducts} title="" />
              </div>
            </motion.div>

            {/* Catalogue complet avec design épuré */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-16" 
              data-section="complete-catalog"
            >
              <div className="bg-gradient-to-r from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800/50">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent mb-4">
                    Notre Catalogue Complet
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Explorez toute notre gamme de produits soigneusement sélectionnés
                  </p>
                </div>
                <ProductCatalogGrid 
                  products={completeProductCatalog} 
                  title="" 
                  showViewAllButton={true}
                />
              </div>
            </motion.div>

            {/* Section témoignages avec design élégant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950/30 dark:via-indigo-950/30 dark:to-blue-950/30 rounded-3xl p-8 border border-purple-200/50 dark:border-purple-800/50">
                <CustomerTestimonialSection />
              </div>
            </motion.div>
          </DataRetryLoader>
        </div>

        {/* Composants administrateurs */}
        <SalesNotification />
        <LiveVisitorCounter />
      </div>
    </Layout>
  );
};

export default HomePage;
