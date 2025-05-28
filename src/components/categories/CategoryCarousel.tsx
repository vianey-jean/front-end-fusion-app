
import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Grid2x2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Category } from '@/types/category';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { categoriesAPI } from '@/services/categoriesAPI';

interface CategoryCarouselProps {
  title?: string;
}

const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  title = "Parcourir nos catégories" 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['active-categories'],
    queryFn: async () => {
      const response = await categoriesAPI.getActive();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Icônes pour représenter visuellement chaque catégorie
  const categoryIcons: Record<string, string> = {
    "Perruques": "/icons/wig.svg",
    "Tissages": "/icons/hair-extension.svg",
    "Queue de cheval": "/icons/ponytail.svg",
    "Peigne chauffance": "/icons/hot-comb.svg",
    "Colle - dissolvant": "/icons/glue.svg",
    "Accessoires": "/icons/accessories.svg",
    "Soins": "/icons/care-products.svg",
    "Promotions": "/icons/discount.svg"
  };

  // Couleurs d'arrière-plan pour chaque catégorie (cycle à travers ces couleurs)
  const bgColors = [
    "bg-red-100 dark:bg-red-900/20",
    "bg-blue-100 dark:bg-blue-900/20", 
    "bg-green-100 dark:bg-green-900/20",
    "bg-purple-100 dark:bg-purple-900/20", 
    "bg-amber-100 dark:bg-amber-900/20",
    "bg-rose-100 dark:bg-rose-900/20"
  ];

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Vérifier initialement
      checkScroll();
    }

    return () => {
      scrollContainer?.removeEventListener('scroll', checkScroll);
    };
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const containerWidth = scrollRef.current.clientWidth;
    const scrollAmount = containerWidth * 0.8;
    
    scrollRef.current.scrollBy({
      left: direction === 'right' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        <div className="flex space-x-4 overflow-hidden">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="min-w-[200px] flex flex-col items-center">
              <Skeleton className="h-20 w-20 rounded-full mb-3" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="relative my-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link to="/categories" className="text-red-600 hover:text-red-800 dark:hover:text-red-400 flex items-center text-sm font-medium">
          Toutes les catégories
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative">
        {showLeftScroll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => scroll('left')}
              className="h-10 w-10 rounded-full bg-white/80 border shadow-sm hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {showRightScroll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-0 top-0 bottom-0 z-10 flex items-center"
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => scroll('right')}
              className="h-10 w-10 rounded-full bg-white/80 border shadow-sm hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link 
                to={`/categorie/${category.name}`}
                className="flex flex-col items-center min-w-[160px] bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-neutral-800 transition-all"
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-3 ${bgColors[index % bgColors.length]}`}>
                  {categoryIcons[category.name] ? (
                    <img 
                      src={categoryIcons[category.name]} 
                      alt={category.name} 
                      className="w-10 h-10"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/icons/default.svg';
                      }}
                    />
                  ) : (
                    <Grid2x2 className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                  )}
                </div>
                <span className="text-sm font-medium text-center">{category.name}</span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {category.description}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;
