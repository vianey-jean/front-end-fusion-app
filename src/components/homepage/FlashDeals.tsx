
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, Flame } from 'lucide-react';
import { useStore, Product } from '@/contexts/StoreContext';
import { productsAPI } from '@/services/api';

const FlashDeals: React.FC = () => {
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<{hours: number, minutes: number, seconds: number}>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchFlashDeals = async () => {
      try {
        setLoading(true);
        // Récupérer les produits en promotion
        const response = await productsAPI.getPromotions();
        setFlashDeals(response.data?.slice(0, 4) || []);
        
        // Définir la fin des ventes flash (24h à partir de maintenant pour la démo)
        const end = new Date();
        end.setHours(end.getHours() + 24);
        setEndTime(end);
      } catch (error) {
        console.error("Erreur lors du chargement des ventes flash:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFlashDeals();
  }, []);
  
  // Compte à rebours
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();
      
      if (difference <= 0) {
        clearInterval(timer);
        return;
      }
      
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);
  
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

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  if (!flashDeals.length && !loading) {
    return null;
  }
  
  return (
    <section className="py-8 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Flame className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-2xl font-bold">Ventes Flash</h2>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-red-600" />
              <span className="text-sm font-medium mr-2">Fin dans:</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <div className="bg-red-600 text-white px-1.5 sm:px-2 py-1 rounded text-xs sm:text-sm font-medium">
                {formatNumber(timeLeft.hours)}
              </div>
              <span>:</span>
              <div className="bg-red-600 text-white px-1.5 sm:px-2 py-1 rounded text-xs sm:text-sm font-medium">
                {formatNumber(timeLeft.minutes)}
              </div>
              <span>:</span>
              <div className="bg-red-600 text-white px-1.5 sm:px-2 py-1 rounded text-xs sm:text-sm font-medium">
                {formatNumber(timeLeft.seconds)}
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:flex items-center ml-4"
              asChild
            >
              <a href="/categorie/promotions">
                Voir tout <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
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
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {flashDeals.map(product => (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="border overflow-hidden group h-full flex flex-col">
                  <div className="relative">
                    <img 
                      src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'} 
                      alt={product.name}
                      className="h-40 w-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    {product.promotion && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        -{product.promotion}%
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3 flex flex-col flex-grow">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-600 font-bold">{product.price.toFixed(2)} €</span>
                        {product.originalPrice && (
                          <span className="text-xs text-neutral-500 line-through">{product.originalPrice.toFixed(2)} €</span>
                        )}
                      </div>
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700"
                        onClick={() => addToCart(product)}
                        disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="flex justify-center mt-4 md:hidden">
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <a href="/categorie/promotions">
              Voir toutes les ventes flash <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
