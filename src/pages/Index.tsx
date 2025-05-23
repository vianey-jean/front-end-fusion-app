import React, { useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { Skeleton } from '@/components/ui/skeleton';

// Composants existants
import ProductGrid from '@/components/products/ProductGrid';
import FeaturedProductsSlider from '@/components/products/FeaturedProductsSlider';
import TestimonialSection from '@/components/reviews/TestimonialSection';
import PromoBanner from '@/components/promotions/PromoBanner';

// Nouveaux composants inspirés d'AliExpress
import CategoryShowcase from '@/components/homepage/CategoryShowcase';
import NewPromoBanner from '@/components/homepage/PromoBanner';
import FlashDeals from '@/components/homepage/FlashDeals';
import RecommendedForYou from '@/components/homepage/RecommendedForYou';
import TopBrands from '@/components/homepage/TopBrands';

const Index: React.FC = () => {
  const { products, loadingProducts, fetchProducts } = useStore();
  
  useEffect(() => {
    fetchProducts();
    // Précharger certaines ressources pour améliorer la performance
    const preloadResources = () => {
      // Précharger les images des bannières, etc.
    };
    preloadResources();
  }, [fetchProducts]);
  
  return (
    <Layout>
      {/* Bannière promotionnelle principale (nouveau style) */}
      <div className="container mx-auto px-4 pt-4">
        <NewPromoBanner />
      </div>
      
      {/* Catégories visuelles */}
      <CategoryShowcase />
      
      {/* Ventes flash */}
      <FlashDeals />
      
      {/* Bannières promotionnelles existantes */}
      <div className="container mx-auto px-4 py-8">
        <PromoBanner />
      </div>
      
      {/* Produits recommandés */}
      <RecommendedForYou />
      
      {/* Marques populaires */}
      <TopBrands />
      
      {/* Produits en vedette (carrousel) */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Produits en vedette</h2>
        {loadingProducts ? (
          <div className="space-y-4">
            <Skeleton className="h-60 w-full" />
          </div>
        ) : (
          <FeaturedProductsSlider products={products.slice(0, 10)} />
        )}
      </div>
      
      {/* Témoignages */}
      <TestimonialSection />
      
      {/* Tous les produits */}
      <div className="container mx-auto px-4 py-12">
        <ProductGrid 
          products={products} 
          title="Explorez notre catalogue" 
          description="Découvrez notre large sélection de produits de qualité à prix compétitifs"
          showFilters={true}
          isLoading={loadingProducts}
        />
      </div>
    </Layout>
  );
};

export default Index;
