
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
      <div className="bg-gradient-to-br from-neutral-50 via-white to-rose-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-rose-950/30">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HomeHeader />
          </motion.div>

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
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gradient-to-r from-red-600 to-pink-600 mx-auto mb-6"></div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Chargement de votre boutique...
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Connexion au serveur en cours...
                  </p>
                </div>
              </motion.div>
            }
          >
            {searchParams.get('q') && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <ProductCatalogGrid
                  products={filteredProductCatalog}
                  title={`Résultats de recherche : "${searchParams.get('q')}"`}
                />
              </motion.div>
            )}

            {!searchParams.get('q') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <FlashSaleBanner />
              </motion.div>
            )}

            {!searchParams.get('q') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FeaturedProductsCarousel products={featuredProductCatalog} />
              </motion.div>
            )}

            {!searchParams.get('q') && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-12" 
                data-section="promotional"
              >
                <PromotionalProductsGrid products={promotionalProducts} />
              </motion.div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-12" 
              data-section="new-arrivals"
            >
              <ProductCatalogGrid products={newArrivalProducts} title="Dernières Nouveautés" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12" 
              data-section="complete-catalog"
            >
              <ProductCatalogGrid 
                products={completeProductCatalog} 
                title="Notre Catalogue Complet" 
                showViewAllButton={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <CustomerTestimonialSection />
            </motion.div>
          </DataRetryLoader>
        </div>

        {/* Composants pour les administrateurs uniquement - SalesNotification au-dessus */}
        <SalesNotification />
        <LiveVisitorCounter />
      </div>
    </Layout>
  );
};

export default HomePage;
