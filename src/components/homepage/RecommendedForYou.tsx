
import React, { useState, useEffect } from 'react';
import { useStore, Product } from '@/contexts/StoreContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { productsAPI } from '@/services/api';
import { Heart, ShoppingBag } from 'lucide-react';

const RecommendedForYou: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { addToCart, toggleFavorite, isFavorite, favorites } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        let response;
        
        // Si l'utilisateur est connecté, essayer de récupérer des recommandations basées sur ses favoris
        if (isAuthenticated && favorites.length > 0) {
          // Simuler des recommandations basées sur les catégories des favoris
          const categories = [...new Set(favorites.map(item => item.category))];
          if (categories.length > 0) {
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            response = await productsAPI.getByCategory(randomCategory);
          }
        }
        
        // Si pas de favoris ou pas connecté, charger les produits populaires
        if (!response || !response.data || response.data.length === 0) {
          response = await productsAPI.getMostFavorited();
        }
        
        // Limiter à 8 produits
        setProducts(response.data?.slice(0, 8) || []);
      } catch (error) {
        console.error("Erreur lors du chargement des recommandations:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [isAuthenticated, favorites]);
  
  if (!products.length && !loading) {
    return null;
  }
  
  return (
    <section className="py-8 bg-white dark:bg-neutral-950">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{isAuthenticated ? "Recommandé pour vous" : "Produits populaires"}</h2>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <Card key={index} className="border">
                <CardContent className="p-0">
                  <Skeleton className="h-40 w-full rounded-t-lg" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/3 mb-3" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {products.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="border overflow-hidden group h-full flex flex-col">
                  <div className="relative">
                    <a href={`/${product.id}`}>
                      <img 
                        src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'} 
                        alt={product.name}
                        className="h-40 w-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    </a>
                    {product.promotion && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.promotion}%
                      </div>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className={`absolute top-2 left-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white ${
                        isFavorite(product.id) ? 'text-red-600' : 'text-gray-600'
                      }`}
                      onClick={() => toggleFavorite(product)}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <CardContent className="p-3 flex flex-col flex-grow">
                    <a href={`/${product.id}`} className="flex-grow">
                      <h3 className="font-medium text-sm mb-1 line-clamp-2 hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>
                    </a>
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-600 font-bold">{product.price.toFixed(2)} €</span>
                        {product.originalPrice && (
                          <span className="text-xs text-neutral-500 line-through">{product.originalPrice.toFixed(2)} €</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-xs"
                          onClick={() => addToCart(product)}
                          disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                        >
                          <ShoppingBag className="h-4 w-4 mr-1" /> Ajouter
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default RecommendedForYou;
