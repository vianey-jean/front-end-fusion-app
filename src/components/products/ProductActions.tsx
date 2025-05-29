
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Eye, ShoppingCart } from 'lucide-react';
import { Product } from '@/contexts/StoreContext';

interface ProductActionsProps {
  product: Product;
  isHovered: boolean;
  isProductFavorite: boolean;
  onFavoriteToggle: (e: React.MouseEvent) => void;
  onQuickView: (e: React.MouseEvent) => void;
  onQuickAdd: (e: React.MouseEvent) => void;
}

const ProductActions: React.FC<ProductActionsProps> = ({
  product,
  isHovered,
  isProductFavorite,
  onFavoriteToggle,
  onQuickView,
  onQuickAdd
}) => {
  return (
    <div className={`absolute bottom-0 left-0 right-0 p-2 flex justify-between bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onFavoriteToggle}
        className="rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-red-600 backdrop-blur-sm"
        title={isProductFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart className={`h-4 w-4 ${isProductFavorite ? 'fill-red-500 text-red-500' : ''}`} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onQuickView}
        className="rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-blue-600 backdrop-blur-sm"
        title="Vue rapide"
      >
        <Eye className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onQuickAdd}
        disabled={!product.isSold || (product.stock !== undefined && product.stock <= 0)}
        className="rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-green-600 backdrop-blur-sm"
        title="Ajouter au panier"
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProductActions;
