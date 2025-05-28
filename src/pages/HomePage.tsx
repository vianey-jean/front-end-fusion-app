
import React, { useState, useEffect } from 'react';
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
import IntelligentSearchBar from '@/components/search/IntelligentSearchBar';
import CategoryCarousel from '@/components/categories/CategoryCarousel';
import EnhancedProductCard from '@/components/products/EnhancedProductCard';
import ProductComparison, { FloatingCompareButton } from '@/components/products/ProductComparison';
import { useProductComparison } from '@/hooks/useProductComparison';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product } from '@/types/product';
import { ArrowRight } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);

  const {
    comparisonProducts,
    isCompareOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparePanel,
    setIsCompareOpen
  } = useProductComparison();

  useCarouselAutoplay(!searchParams.get('q'), dataLoadingComplete, featuredProductCatalog.length);

  // Filtrage des produits selon la recherche (conformité RGPD)
  useEffect(() => {
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

  // Gérer les produits à afficher en fonction de l'onglet actif
  useEffect(() => {
    if (activeTab === "nouveautes") {
      setDisplayedProducts(newArrivalProducts);
    } else if (activeTab === "promotions") {
      setDisplayedProducts(promotionalProducts);
    } else if (activeTab === "favoris") {
      setDisplayedProducts(featuredProductCatalog);
    } else {
      setDisplayedProducts(filteredProductCatalog); // 'tous' est l'onglet par défaut
    }
  }, [activeTab, filteredProductCatalog, newArrivalProducts, promotionalProducts, featuredProductCatalog]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <HomeHeader />

        {/* Barre de recherche intelligente */}
        {!searchParams.get('q') && (
          <div className="max-w-2xl mx-auto mb-10">
            <IntelligentSearchBar />
          </div>
        )}

        <DataRetryLoader
          fetchFunction={loadEcommerceProductData}
          onSuccess={handleDataLoadingSuccess}
          onMaxRetriesReached={handleMaxRetriesReached}
          maxRetries={6}
          retryInterval={5000}
          errorMessage="Erreur de chargement des produits"
          loadingComponent={
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
              <h2 className="text-xl font-semibold mb-2">Chargement de votre boutique...</h2>
              <p className="text-gray-600">Connexion au serveur en cours...</p>
            </div>
          }
        >
          {/* Résultats de recherche */}
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

          {/* Catégories */}
          {!searchParams.get('q') && (
            <CategoryCarousel />
          )}

          {/* Bannière Flash Sale - seulement si pas de recherche */}
          {!searchParams.get('q') && (
            <FlashSaleBanner />
          )}

          {/* Produits vedettes */}
          {!searchParams.get('q') && (
            <FeaturedProductsCarousel products={featuredProductCatalog} />
          )}

          {/* Produits en promotion */}
          {!searchParams.get('q') && (
            <PromotionalProductsGrid products={promotionalProducts} />
          )}

          {/* Catalogue avec onglets */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Explorez nos produits</h2>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="tous">Tous les produits</TabsTrigger>
                  <TabsTrigger value="nouveautes">Nouveautés</TabsTrigger>
                  <TabsTrigger value="promotions">Promotions</TabsTrigger>
                  <TabsTrigger value="favoris">Les plus populaires</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedProducts.slice(0, 12).map(product => (
                      <EnhancedProductCard
                        key={product.id}
                        product={product}
                        onCompare={addToComparison}
                      />
                    ))}
                  </div>

                  {displayedProducts.length > 12 && (
                    <div className="mt-6 text-center">
                      <a 
                        href={activeTab === 'tous' ? '/produits' : `/produits?filtre=${activeTab}`}
                        className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                      >
                        Voir plus de produits
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Témoignages clients */}
          <CustomerTestimonialSection />
          
          {/* Composant de comparaison */}
          <ProductComparison
            products={comparisonProducts}
            isOpen={isCompareOpen}
            onOpenChange={setIsCompareOpen}
            onRemove={removeFromComparison}
            onClear={clearComparison}
          />
          
          {/* Bouton flottant de comparaison */}
          <FloatingCompareButton 
            count={comparisonProducts.length}
            onClick={toggleComparePanel}
          />
        </DataRetryLoader>
      </div>
    </Layout>
  );
};

export default HomePage;
