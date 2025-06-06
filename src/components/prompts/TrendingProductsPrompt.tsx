import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, TrendingUp, ArrowRight, Zap, Sparkles, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/contexts/StoreContext';

interface TrendingProductsPromptProps {
  products: Product[];
  title?: string;
  dismissKey?: string;
}

interface SectionInfo {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  linkText: string;
  linkPath: string;
  gradient: string;
  iconColor: string;
}

const TrendingProductsPrompt: React.FC<TrendingProductsPromptProps> = ({ 
  products, 
  dismissKey = "trending-products-dismissed"
}) => {
  const location = useLocation();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(dismissKey) === 'true';
  });

  const [currentSection, setCurrentSection] = useState<SectionInfo>({
    id: 'featured',
    title: 'Produits populaires',
    icon: TrendingUp,
    linkText: 'Voir plus de produits',
    linkPath: '/populaires',
    gradient: 'from-red-500 to-pink-500',
    iconColor: 'text-red-400'
  });

  const sections: SectionInfo[] = [
    {
      id: 'featured',
      title: 'Produits populaires',
      icon: TrendingUp,
      linkText: 'Voir plus de produits populaires',
      linkPath: '/populaires',
      gradient: 'from-red-500 to-pink-500',
      iconColor: 'text-red-400'
    },
    {
      id: 'promotional',
      title: 'Offres promotionnelles',
      icon: Zap,
      linkText: 'Voir toutes les promotions',
      linkPath: '/promotions',
      gradient: 'from-yellow-500 to-orange-500',
      iconColor: 'text-yellow-400'
    },
    {
      id: 'new-arrivals',
      title: 'Dernières nouveautés',
      icon: Sparkles,
      linkText: 'Voir toutes les nouveautés',
      linkPath: '/nouveautes',
      gradient: 'from-purple-500 to-indigo-500',
      iconColor: 'text-purple-400'
    },
    {
      id: 'complete-catalog',
      title: 'Tous les produits',
      icon: Package,
      linkText: 'Voir tous les produits',
      linkPath: '/tous-les-produits',
      gradient: 'from-blue-500 to-cyan-500',
      iconColor: 'text-blue-400'
    }
  ];

  useEffect(() => {
    const detectVisibleSection = () => {
      // Chercher les sections par leur contenu textuel ou data attributes
      const heroSection = document.querySelector('[class*="hero"]') || document.querySelector('h1');
      const featuredSection = document.querySelector('h2[class*="text-gradient"]') || 
                             Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.includes('populaires') || h.textContent?.includes('Vedettes'));
      const promotionalSection = Array.from(document.querySelectorAll('h2')).find(h => 
        h.textContent?.includes('Offres') || h.textContent?.includes('Promotions') || h.textContent?.includes('Exceptionnelles')
      );
      const newArrivalsSection = Array.from(document.querySelectorAll('h2')).find(h => 
        h.textContent?.includes('Nouveautés') || h.textContent?.includes('Dernières')
      );
      const completeCatalogSection = Array.from(document.querySelectorAll('h2')).find(h => 
        h.textContent?.includes('Catalogue') || h.textContent?.includes('Complet') || h.textContent?.includes('tous')
      );

      const isInViewport = (element: Element | null) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementMiddle = rect.top + rect.height / 2;
        const threshold = windowHeight * 0.4; // 40% du viewport
        return elementMiddle >= 0 && elementMiddle <= windowHeight && rect.top <= threshold;
      };

      // Vérifier les sections dans l'ordre de priorité
      if (isInViewport(completeCatalogSection)) {
        setCurrentSection(sections[3]); // Tous les produits
      } else if (isInViewport(newArrivalsSection)) {
        setCurrentSection(sections[2]); // Nouveautés
      } else if (isInViewport(promotionalSection)) {
        setCurrentSection(sections[1]); // Promotions
      } else if (isInViewport(featuredSection)) {
        setCurrentSection(sections[0]); // Populaires
      }
      // Si on est en haut de page (hero), on garde les produits populaires par défaut
    };

    detectVisibleSection();

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          detectVisibleSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', detectVisibleSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', detectVisibleSection);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, 'true');
    setIsDismissed(true);
  };

  // N'afficher que sur la page d'accueil
  if (location.pathname !== '/' || products.length === 0 || isDismissed) {
    return null;
  }

  const IconComponent = currentSection.icon;

  // Filtrer les produits selon la section courante
  const getFilteredProducts = () => {
    switch (currentSection.id) {
      case 'promotional':
        const promotionalProducts = products.filter(product => 
          product.promotion && 
          product.promotionEnd && 
          new Date(product.promotionEnd) > new Date()
        );
        return promotionalProducts.length > 0 ? promotionalProducts.slice(0, 3) : products.slice(0, 3);
      
      case 'new-arrivals':
        const sortedByDate = [...products].sort((a, b) =>
          new Date(b.dateAjout || 0).getTime() - new Date(a.dateAjout || 0).getTime()
        );
        return sortedByDate.slice(0, 3);
      
      case 'complete-catalog':
        return products.slice(0, 3);
      
      default: // featured/popular
        return products.slice(0, 3);
    }
  };

  const displayedProducts = getFilteredProducts();

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="fixed bottom-6 right-6 z-50 max-w-sm"
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ duration: 0.5, type: "spring", damping: 15 }}
        key={currentSection.id}
      >
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden backdrop-blur-sm">
          {/* Header avec gradient */}
          <div className={`bg-gradient-to-r ${currentSection.gradient} p-4 text-white relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="bg-white/20 rounded-lg p-2"
                >
                  <IconComponent className="h-5 w-5" />
                </motion.div>
                <h3 className="font-bold text-sm">{currentSection.title}</h3>
              </div>
              <motion.button 
                onClick={handleDismiss}
                className="text-white/80 hover:text-white transition-colors bg-white/20 rounded-lg p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
            
            {/* Étoiles décoratives */}
            <div className="absolute top-2 right-16 opacity-30">
              <Star className="h-3 w-3 animate-pulse" />
            </div>
            <div className="absolute bottom-2 left-16 opacity-20">
              <Star className="h-2 w-2 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
          
          {/* Contenu des produits */}
          <div className="p-4">
            <div className="space-y-3">
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link 
                    to={`/produit/${product.id}`}
                    className="group flex items-center p-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-neutral-800 dark:hover:to-neutral-700 rounded-xl transition-all duration-200"
                  >
                    <div className="relative">
                      <img 
                        src={`${import.meta.env.VITE_API_BASE_URL}${product.image || (product.images && product.images[0])}`} 
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                      {product.promotion && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          %
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-1 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {product.promotion && (
                          <motion.span 
                            className="text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-full font-medium"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            -{product.promotion}%
                          </motion.span>
                        )}
                        <p className="text-xs font-bold text-green-600">
                          {product.price.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                    
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-4 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <Link 
                to={currentSection.linkPath}
                className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${currentSection.gradient} bg-clip-text text-transparent hover:underline group`}
              >
                {currentSection.linkText}
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform text-gray-600" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TrendingProductsPrompt;
