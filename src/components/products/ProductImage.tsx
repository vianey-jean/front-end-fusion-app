
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ProductImageProps {
  images: string[];
  name: string;
  isHovered: boolean;
  promotion?: number | null;
  promotionEnd?: string | null;
  dateAjout?: string;
  featured?: boolean;
}

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const ProductImage: React.FC<ProductImageProps> = ({
  images,
  name,
  isHovered,
  promotion,
  promotionEnd,
  dateAjout,
  featured = false
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const getPromotionTimeLeft = (endDate: string) => {
    if (!endDate) return "";
    
    const end = new Date(endDate);
    const now = new Date();
    const diffInMs = end.getTime() - now.getTime();
    
    if (diffInMs <= 0) return "Expirée";
    
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays}j ${diffInHours}h`;
    } else {
      const diffInMins = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffInHours}h ${diffInMins}m`;
    }
  };

  const isPromotionActive = promotion && 
    promotionEnd && 
    new Date(promotionEnd) > new Date();

  const isNewProduct = dateAjout && 
    new Date().getTime() - new Date(dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000;

  // Rotation des images au survol
  React.useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  return (
    <div className="relative h-full bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      {images.length > 0 ? (
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImageIndex}
            src={getImageUrl(images[currentImageIndex])} 
            alt={`Photo de ${name}`} 
            className="w-full h-full object-contain transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = PLACEHOLDER_IMAGE;
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </AnimatePresence>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
          <div className="h-12 w-12 text-neutral-400">📦</div>
        </div>
      )}
      
      {/* Badges */}
      {isPromotionActive && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between">
          <Badge className="m-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">
            -{promotion}%
          </Badge>
          {promotionEnd && (
            <div className="m-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Clock className="h-3 w-3 mr-1" /> {getPromotionTimeLeft(promotionEnd)}
            </div>
          )}
        </div>
      )}
      
      {isNewProduct && (
        <Badge className="absolute top-2 left-2 bg-blue-600 text-white">Nouveau</Badge>
      )}
      
      {featured && (
        <Badge className="absolute top-2 right-2 bg-amber-500 text-white">Recommandé</Badge>
      )}
    </div>
  );
};

export default ProductImage;
