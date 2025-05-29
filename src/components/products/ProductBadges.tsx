
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { Product } from '@/contexts/StoreContext';

interface ProductBadgesProps {
  product: Product;
  featured?: boolean;
}

const ProductBadges: React.FC<ProductBadgesProps> = ({ product, featured = false }) => {
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

  const isPromotionActive = product.promotion && 
    product.promotionEnd && 
    new Date(product.promotionEnd) > new Date();

  const isNewProduct = product.dateAjout && 
    new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div className="absolute top-0 left-0 right-0 flex items-center justify-between">
      <div className="flex flex-col gap-1 m-2">
        {isPromotionActive && (
          <Badge className="bg-red-600 text-white px-2 py-1 text-xs font-bold">
            -{product.promotion}%
          </Badge>
        )}
        {isNewProduct && (
          <Badge className="bg-blue-600 text-white">Nouveau</Badge>
        )}
      </div>
      
      <div className="flex flex-col gap-1 m-2">
        {featured && (
          <Badge className="bg-amber-500 text-white">Recommandé</Badge>
        )}
        {isPromotionActive && product.promotionEnd && (
          <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" /> {getPromotionTimeLeft(product.promotionEnd)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductBadges;
