
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Flame, Clock, Timer, Zap, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { flashSaleAPI } from '@/services/flashSaleAPI';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  isSold: boolean;
  promotion?: number | null;
  promotionEnd?: string | null;
  stock?: number;
  dateAjout?: string;
  flashSaleDiscount?: number;
  flashSaleStartDate?: string;
  flashSaleEndDate?: string;
  flashSaleTitle?: string;
  flashSaleDescription?: string;
  originalFlashPrice?: number;
  flashSalePrice?: number;
}

const FlashSalePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);
  const [flashSaleProducts, setFlashSaleProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [flashSaleInfo, setFlashSaleInfo] = useState<{
    title: string;
    description: string;
    discount: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  // Récupérer les produits de vente flash depuis l'API
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Chargement des produits de vente flash depuis l\'API');

        // Utiliser uniquement l'API, pas d'accès direct aux fichiers JSON
        const response = await flashSaleAPI.getBanniereProducts();
        const products = response.data;
        
        console.log('📦 Produits de vente flash récupérés via API:', products);

        if (!products || products.length === 0) {
          console.log('❌ Aucun produit dans la réponse API');
          setFlashSaleProducts([]);
          setFlashSaleInfo(null);
          setIsLoading(false);
          return;
        }

        // Utiliser les informations du premier produit pour la vente flash
        const firstProduct = products[0];
        setFlashSaleInfo({
          title: firstProduct.flashSaleTitle || 'Vente Flash',
          description: firstProduct.flashSaleDescription || 'Profitez de nos offres exceptionnelles !',
          discount: firstProduct.flashSaleDiscount || 0,
          startDate: firstProduct.flashSaleStartDate || '',
          endDate: firstProduct.flashSaleEndDate || ''
        });

        // Traiter les produits pour s'assurer que le prix affiché est le prix de vente flash
        const processedProducts = products.map(product => ({
          ...product,
          // Utiliser flashSalePrice comme prix principal si disponible
          price: product.flashSalePrice || product.price,
          // Conserver le prix original pour l'affichage de la réduction
          originalPrice: product.originalFlashPrice || product.originalPrice || product.price
        }));

        setFlashSaleProducts(processedProducts);

      } catch (error) {
        console.error('💥 Erreur lors du chargement des produits de vente flash via API:', error);
        setFlashSaleProducts([]);
        setFlashSaleInfo(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, [id]);

  // Calculer le temps restant
  useEffect(() => {
    if (!flashSaleInfo || !flashSaleInfo.endDate) return;

    const calculateTimeLeft = () => {
      const endTime = new Date(flashSaleInfo.endDate).getTime();
      const difference = endTime - new Date().getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [flashSaleInfo]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950">
          <div className="container mx-auto px-4 py-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Chargement de la vente flash...
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                  Préparation des offres exceptionnelles
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!flashSaleInfo || flashSaleProducts.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
          <div className="container mx-auto px-4 py-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 max-w-lg mx-auto border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Flame className="h-10 w-10 text-neutral-400" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                  Aucune vente flash active
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Il n'y a actuellement aucune vente flash disponible. Revenez bientôt pour découvrir nos prochaines offres exceptionnelles !
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isExpired) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
          <div className="container mx-auto px-4 py-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-12 max-w-lg mx-auto border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
                <div className="w-20 h-20 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Timer className="h-10 w-10 text-neutral-400" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                  Vente flash expirée
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Cette vente flash est terminée. Restez connecté pour ne pas manquer nos prochaines offres exceptionnelles !
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  const timeUnits = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950">
        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Flash Sale Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white rounded-2xl p-12 mb-12 shadow-2xl"
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 animate-pulse"></div>
            
            <div className="relative text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center space-x-4 mb-6"
              >
                <div className="relative">
                  <Flame className="h-12 w-12 text-yellow-300 animate-bounce" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                    <Sparkles className="h-2 w-2 text-red-600" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  {flashSaleInfo.title}
                </h1>
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-yellow-400 text-red-800 px-6 py-3 rounded-full text-xl font-bold shadow-lg"
                >
                  -{flashSaleInfo.discount}%
                </motion.div>
              </motion.div>
              
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl mx-auto">
                {flashSaleInfo.description}
              </p>
              
              <div className="flex justify-center items-center space-x-3 mb-6">
                <Clock className="h-6 w-6 text-yellow-300" />
                <span className="text-xl font-medium">Se termine dans :</span>
              </div>
              
              <div className="flex justify-center space-x-6">
                {timeUnits.map((time, index) => (
                  <motion.div
                    key={time.label}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      key={time.value}
                      initial={{ rotateX: -90 }}
                      animate={{ rotateX: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-black/40 backdrop-blur-sm rounded-xl px-6 py-4 min-w-[80px] mb-3 border border-white/20"
                    >
                      <div className="text-3xl md:text-4xl font-bold text-white">
                        {time.value.toString().padStart(2, '0')}
                      </div>
                    </motion.div>
                    <div className="text-sm font-medium opacity-80">{time.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Products Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-neutral-200/50 dark:border-neutral-700/50 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Produits en vente flash
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {flashSaleProducts.length} produits
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      ))}
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 ml-2">
                        Offres exceptionnelles
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {flashSaleProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        FLASH -{flashSaleInfo.discount}%
                      </div>
                    </div>
                    <ProductCard 
                      product={{
                        ...product,
                        promotion: product.flashSaleDiscount || product.promotion
                      }} 
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default FlashSalePage;
