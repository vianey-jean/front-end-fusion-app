
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
import { ShoppingBag, ChevronLeft, ChevronRight, TrendingUp, Percent, Sparkles, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProductFilters } from '@/hooks/useProductFilters';

const PromotionalProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

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
    products, 
    promotionFilter: true 
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsAPI.getAll();
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de données incorrect');
        }
        
        setProducts(response.data);
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

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

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

  const promotionStats = [
    {
      icon: <Percent className="h-6 w-6" />,
      title: "Jusqu'à 70%",
      subtitle: "de réduction",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Produits premium",
      subtitle: "à prix réduits",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Timer className="h-6 w-6" />,
      title: "Offres limitées",
      subtitle: "dans le temps",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-red-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-red-950/30">
        {/* Hero Section améliorée */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-800 dark:from-red-800 dark:via-red-900 dark:to-red-950">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Promotions Exceptionnelles
              </h1>
              <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                Profitez de nos offres spéciales sur une sélection de produits de beauté capillaire. 
                Des prix réduits pour vous permettre de découvrir nos meilleures références.
              </p>
              
              {/* Stats cards */}
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {promotionStats.map((stat, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${stat.color} mb-3`}>
                      {stat.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">{stat.title}</h3>
                    <p className="text-red-100">{stat.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <ProductsPageHeader
            title="Tous nos produits en promotion"
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
            
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="border rounded-xl p-4 h-[300px] animate-pulse bg-white/50 dark:bg-neutral-800/50">
                      <div className="w-full h-40 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg mb-4 animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : currentProducts.length > 0 ? (
                <>
                  <ProductGrid products={currentProducts} />
                  
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-12 p-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl border border-neutral-200 dark:border-neutral-700">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Page <span className="font-bold text-red-600">{currentPage}</span> sur <span className="font-bold">{totalPages}</span> - 
                        <span className="font-bold text-red-600 ml-1">{sortedProducts.length}</span> produit{sortedProducts.length > 1 ? 's' : ''} au total
                      </div>
                      <div className="flex gap-3">
                        {currentPage > 1 && (
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Précédent
                          </Button>
                        )}
                        
                        {currentPage < totalPages && (
                          <Button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                          >
                            Suivant
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl text-center border border-neutral-200 dark:border-neutral-700">
                  <div className="bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 p-6 rounded-2xl mb-6">
                    <ShoppingBag className="h-16 w-16 text-neutral-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-neutral-800 dark:text-neutral-200">Aucun produit en promotion trouvé</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md leading-relaxed">
                    Nous n'avons trouvé aucun produit en promotion correspondant à vos critères de recherche. 
                    Essayez de modifier vos filtres pour découvrir nos offres.
                  </p>
                  <Button 
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Réinitialiser tous les filtres
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
