
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import DesktopFilters from '@/components/filters/DesktopFilters';
import FilterBadges from '@/components/filters/FilterBadges';
import ProductsPageHeader from '@/components/products/ProductsPageHeader';
import { Product } from '@/contexts/StoreContext';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { ShoppingBag, TrendingUp, Sparkles, Star, Filter } from 'lucide-react';
import { useProductFilters } from '@/hooks/useProductFilters';
import { motion } from 'framer-motion';

const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryTitle = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : '';

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
    categoryFilter: categoryName 
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
        console.error("Erreur lors du chargement des produits:", error);
        toast.error("Impossible de charger les produits");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryName]);

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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-purple-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-purple-950/30">
        {/* Enhanced Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-20"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                  <TrendingUp className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              {categoryTitle}
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez notre sélection de {categoryTitle.toLowerCase()} de qualité premium. 
              Des produits soigneusement choisis pour sublimer votre beauté naturelle.
            </p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 text-sm text-purple-200"
            >
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>Qualité premium</span>
              </div>
              <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Livraison gratuite dès 50€</span>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neutral-50 to-transparent dark:from-neutral-950"></div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ProductsPageHeader
              title={categoryTitle}
              productCount={sortedProducts.length}
              sortOption={sortOption}
              setSortOption={setSortOption}
              mobileFiltersProps={mobileFiltersProps}
            />
          </motion.div>
          
          <FilterBadges 
            badges={getFilterBadges()} 
            onClearAll={resetFilters}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-1"
            >
              <div className="sticky top-8">
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Filter className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Filtres
                    </h3>
                  </div>
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
              </div>
            </motion.div>
            
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-neutral-800 rounded-xl p-4 h-[350px] animate-pulse shadow-lg"
                    >
                      <div className="w-full h-48 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gradient-to-r from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              ) : sortedProducts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <ProductGrid products={sortedProducts} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl text-center border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-neutral-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Aucun produit trouvé</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md leading-relaxed">
                    Nous n'avons trouvé aucun produit correspondant à vos critères de recherche dans cette catégorie. 
                    Essayez d'ajuster vos filtres ou de parcourir d'autres catégories.
                  </p>
                  <Button 
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Réinitialiser tous les filtres
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
