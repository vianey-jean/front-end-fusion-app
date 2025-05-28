
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, BarChart2 } from 'lucide-react';
import { Product } from '@/types/product';
import { getSecureProductId } from '@/services/secureIds';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import QuickViewModal from './QuickViewModal';

interface EnhancedProductCardProps {
  product: Product;
  onCompare?: (product: Product) => void;
  enableQuickView?: boolean;
}

const EnhancedProductCard: React.FC<EnhancedProductCardProps> = ({
  product,
  onCompare,
  enableQuickView = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const isProductFavorite = isFavorite(product.id);
  const productUrl = `/${getSecureProductId(product.id, 'product')}`;
  const isInStock = product.isSold && (product.stock === undefined || product.stock > 0);

  const getSecureImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter au panier");
      return;
    }
    
    if (isInStock) {
      addToCart(product);
      toast.success("Produit ajouté au panier");
    } else {
      toast.error("Ce produit n'est pas disponible");
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    
    toggleFavorite(product);
    toast.success(isProductFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompare) {
      onCompare(product);
      toast.success("Produit ajouté à la comparaison");
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const variants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hover: { scale: 1.05 },
    initial: { scale: 1 },
  };

  return (
    <>
      <motion.div
        className="group relative overflow-hidden rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Link to={productUrl} className="block h-full">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.promotion && product.promotionEnd && new Date(product.promotionEnd) > new Date() && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                -{product.promotion}%
              </span>
            )}
            
            {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                Nouveau
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="absolute z-10 right-3">
            <motion.div 
              className="flex flex-col gap-2"
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
            >
              <motion.button
                onClick={handleToggleFavorite}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isProductFavorite 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                } shadow-md`}
                variants={variants}
              >
                <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-red-500' : ''}`} />
              </motion.button>
              
              {enableQuickView && (
                <motion.button
                  onClick={handleQuickView}
                  className="w-8 h-8 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
                  variants={variants}
                >
                  <Eye className="h-4 w-4" />
                </motion.button>
              )}
              
              {onCompare && (
                <motion.button
                  onClick={handleCompare}
                  className="w-8 h-8 bg-white text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 shadow-md"
                  variants={variants}
                >
                  <BarChart2 className="h-4 w-4" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Image */}
          <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
            <motion.img
              src={getSecureImageUrl(product.image)}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-contain p-4"
              initial="initial"
              animate={isHovered ? "hover" : "initial"}
              variants={imageVariants}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
            
            {/* Out of stock overlay */}
            {!isInStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-medium">
                Rupture de stock
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-1">
              <span className="text-xs text-gray-500">{product.category}</span>
            </div>
            
            <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
            
            <div className="mt-2 flex items-center justify-between">
              <div>
                {product.promotion && product.promotionEnd && new Date(product.promotionEnd) > new Date() ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 line-through">
                      {typeof product.originalPrice === 'number'
                        ? product.originalPrice.toFixed(2)
                        : product.price.toFixed(2)}€
                    </span>
                    <span className="font-medium text-red-600">{product.price.toFixed(2)}€</span>
                  </div>
                ) : (
                  <span className="font-medium">{product.price.toFixed(2)}€</span>
                )}
              </div>

              <motion.button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isInStock 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                whileTap={isInStock ? { scale: 0.9 } : {}}
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Modal de vue rapide */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default EnhancedProductCard;
