
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
import { ShoppingBag, ChevronLeft, ChevronRight, TrendingUp, Sparkles, Star } from 'lucide-react';
import { useProductFilters } from '@/hooks/useProductFilters';
import { motion } from 'framer-motion';

const NewArrivalsPage = () => {
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
    activeFilters,
    resetFilters,
    getFilterBadges
  } = useProductFilters({ products });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Essayer d'abord de récupérer les nouveautés via l'API spécialisée
        try {
          const newArrivalsResponse = await productsAPI.getNewArrivals();
          if (newArrivalsResponse.data && Array.isArray(newArrivalsResponse.data)) {
            setProducts(newArrivalsResponse.data);
            return;
          }
        } catch (error) {
          console.log("API nouveautés non disponible, fallback sur tous les produits");
        }
        
        // Fallback: récupérer tous les produits et trier par date
        const response = await productsAPI.getAll();
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de données incorrect');
        }
        
        // Trier par date d'ajout pour avoir les nouveautés
        const sortedByDate = [...response.data].sort((a, b) => {
          const dateA = a.dateAjout ? new Date(a.dateAjout).getTime() : 0;
          const dateB = b.dateAjout ? new Date(b.dateAjout).getTime() : 0;
          return dateB - dateA;
        });
        
        // Prendre les 50 produits les plus récents
        const newArrivals = sortedByDate.slice(0, 50);
        setProducts(newArrivals);
      } catch (error) {
        console.error("Erreur lors du chargement des nouveautés:", error);
        toast.error("Impossible de charger les nouveautés");
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
    resetFilters
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-neutral-900 dark:to-purple-950">
        {/* Enhanced Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="text-center max-w-4xl mx-auto">
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
                Dernières Nouveautés
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
                Découvrez nos dernières nouveautés en beauté capillaire. Les produits les plus récents pour sublimer votre style avec les dernières tendances.
              </p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-4 text-sm text-purple-200"
              >
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>Produits tendance</span>
                </div>
                <div className="w-1 h-1 bg-purple-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Livraison rapide</span>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-indigo-50 to-transparent dark:from-indigo-950"></div>
        </motion.div>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ProductsPageHeader
              title="Dernières nouveautés"
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
            >
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
                resetFilters={resetFilters}
              />
            </motion.div>
            
            <div className="md:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(16)].map((_, i) => (
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
              ) : currentProducts.length > 0 ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ProductGrid products={currentProducts} />
                  </motion.div>
                  
                  {totalPages > 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex justify-between items-center mt-12 p-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl"
                    >
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        Page {currentPage} sur {totalPages} - {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} au total
                      </div>
                      <div className="flex gap-2">
                        {currentPage > 1 && (
                          <Button
                            variant="outline"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="flex items-center gap-2 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Précédent
                          </Button>
                        )}
                        
                        {currentPage < totalPages && (
                          <Button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            Suivant
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-20 px-6 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl text-center border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-neutral-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Aucune nouveauté trouvée</h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md leading-relaxed">
                    Nous n'avons trouvé aucune nouveauté correspondant à vos critères de recherche.
                  </p>
                  <Button 
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
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

export default NewArrivalsPage;
