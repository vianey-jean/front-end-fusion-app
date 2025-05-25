
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product, useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureId } from '@/services/secureIds';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import { useProductReviews } from '@/hooks/useProductReviews';
import ProductImage from './ProductImage';
import ProductActions from './ProductActions';
import ProductInfo from './ProductInfo';

interface ProductCardProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  featured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  size = 'medium',
  featured = false
}) => {
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const { averageRating, reviewCount } = useProductReviews(product.id);
  const [isHovered, setIsHovered] = useState(false);
  
  const isProductFavorite = isFavorite(product.id);
  const secureId = getSecureId(product.id, 'product');
  const displayImages = product.images && product.images.length > 0 
    ? product.images 
    : product.image ? [product.image] : [];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier", {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    
    if (!product.isSold || (product.stock !== undefined && product.stock <= 0)) {
      toast.error("Ce produit est en rupture de stock");
      return;
    }
    
    addToCart(product);
    toast.success("Produit ajouté au panier");
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product);
    
    toast.success(isProductFavorite ? "Produit retiré des favoris" : "Produit ajouté aux favoris");
  };

  const heightClasses = {
    small: 'h-[300px]',
    medium: 'h-[380px]',
    large: 'h-[450px]'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={featured ? 'z-10 scale-105' : ''}
    >
      <Card className={`overflow-hidden ${heightClasses[size]} flex flex-col border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 rounded-xl hover:shadow-lg transition-all duration-300 ${featured ? 'shadow-md ring-1 ring-red-200 dark:ring-red-900' : ''}`}>
        <div className="relative h-[60%]">
          <ProductImage
            images={displayImages}
            name={product.name}
            isHovered={isHovered}
            promotion={product.promotion}
            promotionEnd={product.promotionEnd}
            dateAjout={product.dateAjout}
            featured={featured}
          />
          
          <ProductActions
            product={product}
            secureId={secureId}
            isVisible={isHovered}
            isFavorite={isProductFavorite}
            onFavoriteToggle={handleFavoriteToggle}
            onQuickAdd={handleQuickAdd}
          />
        </div>
        
        <CardContent className="p-0 flex-grow">
          <ProductInfo
            product={product}
            secureId={secureId}
            averageRating={averageRating}
            reviewCount={reviewCount}
            onQuickAdd={handleQuickAdd}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
