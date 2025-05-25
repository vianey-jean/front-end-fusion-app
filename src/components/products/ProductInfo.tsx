
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/services/products.api';
import StarRating from '@/components/reviews/StarRating';

interface ProductInfoProps {
  product: Product;
  secureId: string;
  averageRating: number;
  reviewCount: number;
  onQuickAdd: (e: React.MouseEvent) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  secureId,
  averageRating,
  reviewCount,
  onQuickAdd
}) => {
  const isPromotionActive = product.promotion && 
    product.promotionEnd && 
    new Date(product.promotionEnd) > new Date();

  return (
    <div className="p-4 flex flex-col flex-grow">
      <Link to={`/${secureId}`} className="block">
        <h3 className="font-medium text-lg mb-1 hover:text-red-600 transition-colors line-clamp-2 text-left">
          {product.name}
        </h3>
      </Link>
      
      <div className="flex items-center mt-1 mb-2">
        <StarRating rating={averageRating} size={14} />
        <span className="text-xs text-neutral-500 ml-1">({reviewCount})</span>
      </div>
      
      <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3 line-clamp-2 text-left">
        {product.description}
      </p>
      
      <div className="flex-grow"></div>
      
      <div className="flex justify-between items-end mt-2 text-left">
        <div>
          {isPromotionActive ? (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-500 line-through">
                  {typeof product.originalPrice === 'number'
                    ? product.originalPrice.toFixed(2)
                    : product.price.toFixed(2)}{' '}
                    €
                </p>
                <p className="font-bold text-red-600">{product.price.toFixed(2)} €</p>
              </div>
            </div>
          ) : (
            <p className="font-bold">{product.price.toFixed(2)} €</p>
          )}
          
          {/* Stock display */}
          {product.stock !== undefined && (
            <div className="mt-1">
              {product.stock === 0 || !product.isSold ? (
                <p className="text-red-500 text-xs">En rupture de stock</p>
              ) : product.stock <= 5 ? (
                <p className="text-orange-500 text-xs">Plus que {product.stock} en stock</p>
              ) : (
                <p className="text-green-500 text-xs">{product.stock} en stock</p>
              )}
            </div>
          )}
        </div>
        
        <Button
          size="sm"
          variant="outline"
          className="h-8 bg-red-50 text-red-700 hover:bg-red-100 border-red-200 hover:border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 dark:border-red-900/50"
          onClick={onQuickAdd}
          disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
        >
          <ShoppingCart className="h-3.5 w-3.5 mr-1" />
          <span>Ajouter</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
