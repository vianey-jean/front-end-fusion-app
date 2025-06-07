
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import HeroSection from '@/components/layout/HeroSection';
import DesktopFilters from '@/components/filters/DesktopFilters';
import FilterBadges from '@/components/filters/FilterBadges';
import ProductsPageHeader from '@/components/products/ProductsPageHeader';
import { Product } from '@/contexts/StoreContext';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Percent, TrendingDown, Star, Sparkles } from 'lucide-react';
import { useProductFilters } from '@/hooks/useProductFilters';

const PromotionalProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    maxPrice,
    sortOption,
    setSortOption,
    sortedProducts,
    showInStock,
    setShowInStock,
    showOutOfStock,
    setShowOutOfStock,
    showPromoOnly,
    setShowPromoOnly,
    activeFilters,
    resetFilters,
    getFilterBadges
  } = useProductFilters({ 
    products: products.filter(product => product.promotion && product.promotion > 0), 
    categoryFilter: '' 
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsAPI.getAll();
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de données incorrect');
        }
        
        const promoProducts = response.data.filter(product => 
          product.promotion && product.promotion > 0
        );
        setProducts(promoProducts);
      } catch (error) {
        console.error("Erreur lors du chargement des produits en promotion:", error);
        toast.error("Impossible de charger les produits en promotion");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const mobileFiltersProps = {
    filtersOpen,
    setFiltersOpen,
    activeFilters,
    searchTerm,
    setSearchTerm,
    priceRange,
    setPriceRange,
    maxPrice,
    showInStock,
    setShowInStock,
    showOutOfStock,
    setShowOutOfStock,
    showPromoOnly,
    setShowPromoOnly,
    resetFilters
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        {/* Hero Section avec design moderne */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-500/10 via-orange-500/10 to-amber-500/10 dark:from-red-500/5 dark:via-orange-500/5 dark:to-amber-500/5">
          <div className="absolute inset-0 bg-grid-neutral-100/50 dark:bg-grid-neutral-800/50" />
          <div className="container mx-auto px-4 py-16 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-2xl shadow-lg">
                  <Percent className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-6">
                Produits en Promotion
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed">
                Profitez de nos offres exceptionnelles ! Des réductions jusqu'à 70% sur une sélection de produits beauté premium.
              </p>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <span>Jusqu'à -70%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-orange-500" />
                  <span>Qualité Premium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  <span>Offres Limitées</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <ProductsPageHeader
            title="Produits en Promotion"
            productCount={sortedProducts.length}
            sortOption={sortOption}
            setSortOption={setSortOption}
            mobileFiltersProps={mobileFiltersProps}
          />
          
          <FilterBadges 
            badges={getFilterBadges()} 
            onClearAll={resetFilters}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-6">
              <DesktopFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                maxPrice={maxPrice}
                showInStock={showInStock}
                setShowInStock={setShowInStock}
                showOutOfStock={showOutOfStock}
                setShowOutOfStock={setShowOutOfStock}
                showPromoOnly={showPromoOnly}
                setShowPromoOnly={setShowPromoOnly}
                resetFilters={resetFilters}
              />
            </div>
            
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="border rounded-xl p-4 h-[300px] animate-pulse bg-white dark:bg-neutral-900">
                      <div className="w-full h-40 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <ProductGrid products={sortedProducts} />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-xl text-center border border-neutral-200 dark:border-neutral-700">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full mb-6">
                    <Percent className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">Aucune promotion trouvée</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
                    Nous n'avons trouvé aucun produit en promotion correspondant à vos critères. 
                    Essayez d'ajuster vos filtres ou revenez plus tard pour de nouvelles offres.
                  </p>
                  <Button 
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromotionalProductsPage;
