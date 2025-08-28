import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { 
  Heart, 
  Share2, 
  ShoppingCart, 
  Eye, 
  GitCompare, 
  Star,
  Zap,
  Gift,
  Truck,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating?: number;
  reviews?: number;
  promotion?: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  freeShipping?: boolean;
  inStock?: boolean;
}

interface ProductQuickActionsProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToFavorites?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onCompare?: (productId: string) => void;
  onShare?: (productId: string) => void;
  variant?: 'default' | 'compact' | 'hover-overlay';
}

const ProductQuickActions: React.FC<ProductQuickActionsProps> = ({
  product,
  onAddToCart,
  onAddToFavorites,
  onQuickView,
  onCompare,
  onShare,
  variant = 'default'
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isInCompare, setIsInCompare] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) {
      toast.error('Produit en rupture de stock');
      return;
    }
    onAddToCart?.(product.id);
    toast.success('Produit ajouté au panier');
  };

  const handleAddToFavorites = () => {
    setIsLiked(!isLiked);
    onAddToFavorites?.(product.id);
    toast.success(isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleQuickView = () => {
    onQuickView?.(product.id);
  };

  const handleCompare = () => {
    setIsInCompare(!isInCompare);
    onCompare?.(product.id);
    toast.success(isInCompare ? 'Retiré de la comparaison' : 'Ajouté à la comparaison');
  };

  const handleShare = () => {
    onShare?.(product.id);
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const calculateDiscountedPrice = () => {
    if (product.promotion) {
      return product.price * (1 - product.promotion / 100);
    }
    return product.price;
  };

  if (variant === 'hover-overlay') {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleQuickView}
              className="bg-white text-black hover:bg-gray-100"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddToFavorites}
              className={`bg-white hover:bg-gray-100 ${isLiked ? 'text-red-500' : 'text-black'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="bg-white text-black hover:bg-gray-100"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between">
        <div className="flex space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleAddToFavorites}
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCompare}
            className={isInCompare ? 'text-blue-500' : ''}
          >
            <GitCompare className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="bg-primary hover:bg-primary/90"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Ajouter
        </Button>
      </div>
    );
  }

  // Default variant
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Product Image with Badges */}
        <div className="relative group">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.isNew && (
              <Badge className="bg-green-600 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Nouveau
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-orange-600 text-white">
                <Star className="h-3 w-3 mr-1" />
                Best-seller
              </Badge>
            )}
            {product.promotion && (
              <Badge className="bg-red-600 text-white">
                -{product.promotion}%
              </Badge>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-2 right-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleAddToFavorites}
              className={`bg-white/90 backdrop-blur-sm ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleQuickView}
              className="bg-white/90 backdrop-blur-sm text-gray-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm text-gray-700"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCompare}
              className={`bg-white/90 backdrop-blur-sm ${isInCompare ? 'text-blue-500' : 'text-gray-700'}`}
            >
              <GitCompare className="h-4 w-4" />
            </Button>
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                Rupture de stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center space-x-1 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.reviews} avis)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            {product.promotion ? (
              <>
                <span className="text-xl font-bold text-red-600">
                  {formatPrice(calculateDiscountedPrice())}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            {product.freeShipping && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <Truck className="h-3 w-3 mr-1" />
                Livraison gratuite
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <Shield className="h-3 w-3 mr-1" />
              Garantie
            </Badge>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
            >
              {product.inStock ? (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ajouter au panier
                </>
              ) : (
                'Rupture de stock'
              )}
            </Button>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickView}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                Aperçu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCompare}
                className={`flex-1 ${isInCompare ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                <GitCompare className="h-4 w-4 mr-1" />
                Comparer
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductQuickActions;