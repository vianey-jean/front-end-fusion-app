
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/contexts/StoreContext';

interface ProductImageProps {
  product: Product;
  secureId: string;
  isHovered: boolean;
  currentImageIndex: number;
}

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PLACEHOLDER_IMAGE = '/placeholder.svg';

const ProductImage: React.FC<ProductImageProps> = ({ 
  product, 
  secureId, 
  isHovered, 
  currentImageIndex 
}) => {
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image ? [product.image] : [];

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  return (
    <div className="relative h-[60%] bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
      <Link to={`/${secureId}`} className="block h-full">
        {displayImages.length > 0 ? (
          <motion.img 
            src={getImageUrl(displayImages[currentImageIndex])} 
            alt={`Photo de ${product.name}`} 
            className="w-full h-full object-contain transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              console.log("Erreur de chargement d'image, utilisation du placeholder");
              const target = e.target as HTMLImageElement;
              target.src = PLACEHOLDER_IMAGE;
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={currentImageIndex}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <ShoppingCart className="h-12 w-12 text-neutral-400" />
          </div>
        )}
      </Link>
    </div>
  );
};

export default ProductImage;
