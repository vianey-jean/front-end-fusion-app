
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '@/contexts/StoreContext';
import { getSecureId } from '@/services/secureIds';

interface CartItemProps {
  item: CartItemType;
  isSelected: boolean;
  onSelectionChange: (productId: string, selected: boolean) => void;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
}

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CartItem: React.FC<CartItemProps> = memo(({
  item,
  isSelected,
  onSelectionChange,
  onQuantityChange,
  onRemove
}) => {
  const secureId = getSecureId(item.product.id, 'product');
  
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const displayImage = item.product.images?.[0] || item.product.image;

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onSelectionChange(item.product.id, !!checked)}
      />
      
      <Link to={`/${secureId}`} className="shrink-0">
        <img
          src={getImageUrl(displayImage)}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded-md"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </Link>

      <div className="flex-grow">
        <Link to={`/${secureId}`}>
          <h3 className="font-medium hover:text-red-600 transition-colors">
            {item.product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.product.description}
        </p>
        <p className="font-semibold mt-1">{item.product.price.toFixed(2)} €</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-8 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
          disabled={item.product.stock !== undefined && item.quantity >= item.product.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.product.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;
