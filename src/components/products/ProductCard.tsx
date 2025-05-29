
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product, useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { getSecureId } from '@/services/secureIds';
import { motion } from 'framer-motion';
import { reviewsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import QuickViewModal from '@/components/products/QuickViewModal';
import ProductBadges from '@/components/products/ProductBadges';
import ProductImage from '@/components/products/ProductImage';
import ProductActions from '@/components/products/ProductActions';
import ProductInfo from '@/components/products/ProductInfo';

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
  const isProductFavorite = isFavorite(product.id);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  // Fetch reviews to calculate ratings
  useEffect(() => {
    const fetchProductReviews = async () => {
      try {
        const response = await reviewsAPI.getProductReviews(product.id);
        const reviews = response.data;
        
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => {
            return sum + ((review.productRating + review.deliveryRating) / 2);
          }, 0);
          
          setAverageRating(totalRating / reviews.length);
          setReviewCount(reviews.length);
        }
      } catch (error) {
        console.error("Error fetching reviews for product:", product.id, error);
      }
    };
    
    fetchProductReviews();
  }, [product.id]);
  
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
    
    if (!isProductFavorite) {
      toast.success("Produit ajouté aux favoris");
    } else {
      toast.success("Produit retiré des favoris");
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Rotation des images au survol
  useEffect(() => {
    if (isHovered && displayImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, displayImages.length]);

  const heightClasses = {
    small: 'h-[300px]',
    medium: 'h-[380px]',
    large: 'h-[450px]'
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImageIndex(0);
        }}
        className={featured ? 'z-10 scale-105' : ''}
      >
        <Card className={`overflow-hidden ${heightClasses[size]} flex flex-col border border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700 rounded-xl hover:shadow-lg transition-all duration-300 ${featured ? 'shadow-md ring-1 ring-red-200 dark:ring-red-900' : ''}`}>
          <div className="relative">
            <ProductImage 
              product={product}
              secureId={secureId}
              isHovered={isHovered}
              currentImageIndex={currentImageIndex}
            />
            
            <ProductBadges product={product} featured={featured} />
            
            <ProductActions
              product={product}
              isHovered={isHovered}
              isProductFavorite={isProductFavorite}
              onFavoriteToggle={handleFavoriteToggle}
              onQuickView={handleQuickView}
              onQuickAdd={handleQuickAdd}
            />
          </div>
          
          <CardContent className="flex-grow p-0">
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

      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
