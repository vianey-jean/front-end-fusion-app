
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { XCircle, CheckCircle, XCircleIcon, Share2, ShoppingCart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Product } from '@/types/product';
import { useStore } from '@/contexts/StoreContext';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import { getSecureProductId } from '@/services/secureIds';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductComparisonProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({ 
  products,
  onRemove,
  onClear,
  isOpen,
  onOpenChange
}) => {
  const { addToCart } = useStore();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [comparisonData, setComparisonData] = useState<Record<string, any>[]>([]);
  const [attributes, setAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (products.length === 0) return;

    // Construire les données de comparaison
    const allAttributes = new Set<string>();
    
    // Extraire tous les attributs disponibles dans les produits
    products.forEach(product => {
      Object.keys(product).forEach(key => {
        // Exclure certains champs
        if (!['id', 'images', 'image', 'dateAjout', 'promotionEnd', 'flashSaleEndDate', 'flashSaleStartDate'].includes(key)) {
          allAttributes.add(key);
        }
      });
    });

    const sortedAttributes = [...allAttributes].sort((a, b) => {
      // Mettre les attributs importants en haut
      const priority = ['name', 'price', 'originalPrice', 'category', 'description', 'promotion', 'stock'];
      const aIndex = priority.indexOf(a);
      const bIndex = priority.indexOf(b);
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });

    setAttributes(sortedAttributes);
    
    // Transformer les données pour l'affichage
    const data = products.map(product => {
      const formattedData: Record<string, any> = {};
      sortedAttributes.forEach(attr => {
        formattedData[attr] = product[attr as keyof Product];
      });
      return formattedData;
    });

    setComparisonData(data);
  }, [products]);

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
  };

  const formatAttributeLabel = (attr: string) => {
    // Transformer camelCase en mots séparés avec première lettre majuscule
    return attr
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const renderValue = (attr: string, value: any, productIndex: number) => {
    if (value === undefined || value === null) return '-';

    switch (attr) {
      case 'name':
        return (
          <Link 
            to={`/${getSecureProductId(products[productIndex].id, 'product')}`}
            className="font-medium text-blue-600 hover:underline"
          >
            {value}
          </Link>
        );
      case 'price':
      case 'originalPrice':
        return value ? `${value.toFixed(2)} €` : '-';
      case 'promotion':
        return value ? `${value}%` : '-';
      case 'isSold':
        return value ? (
          <span className="text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1" /> En stock</span>
        ) : (
          <span className="text-red-600 flex items-center"><XCircle className="h-4 w-4 mr-1" /> Rupture</span>
        );
      case 'description':
        return <div className="max-w-xs truncate">{value}</div>;
      case 'stock':
        return value !== undefined ? `${value} unité(s)` : 'Illimité';
      case 'image':
        return (
          <img 
            src={getImageUrl(value)} 
            alt={comparisonData[productIndex].name} 
            className="w-20 h-20 object-contain mx-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        );
      default:
        return typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value.toString();
    }
  };

  const areValuesEqual = (attr: string, productIndex: number) => {
    if (products.length <= 1 || productIndex === 0) return false;
    
    const value = comparisonData[productIndex][attr];
    const firstValue = comparisonData[0][attr];
    
    return JSON.stringify(value) === JSON.stringify(firstValue);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  const handleShare = () => {
    const productIds = products.map(p => p.id).join(',');
    const compareUrl = `${window.location.origin}/compare?products=${productIds}`;
    navigator.clipboard.writeText(compareUrl);
    toast.success("Lien de comparaison copié!");
  };

  return (
    <Sheet open={isOpen && products.length > 0} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] w-full max-w-full">
        <SheetHeader className="flex flex-row items-center justify-between px-1">
          <div>
            <SheetTitle>Comparaison de produits</SheetTitle>
            <SheetDescription>
              Comparez les caractéristiques de {products.length} produit{products.length > 1 ? 's' : ''}
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShare} size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Partager
            </Button>
            <Button variant="outline" onClick={onClear} size="sm">
              Vider
            </Button>
          </div>
        </SheetHeader>
        
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-slate-900 z-10">
              <TableRow>
                <TableHead className="min-w-[150px]">Caractéristiques</TableHead>
                {products.map((product, idx) => (
                  <TableHead key={product.id} className="min-w-[200px] relative">
                    <div className="flex items-start">
                      <div className="flex-1">
                        {renderValue('image', product.image, idx)}
                      </div>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <XCircleIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {attributes.map(attr => {
                if (attr === 'image') return null; // Skip image, already displayed in header
                
                return (
                  <TableRow key={attr}>
                    <TableCell className="font-medium">{formatAttributeLabel(attr)}</TableCell>
                    {comparisonData.map((data, idx) => (
                      <TableCell 
                        key={`${products[idx].id}-${attr}`}
                        className={areValuesEqual(attr, idx) ? 'bg-gray-50 dark:bg-slate-800/50' : ''}
                      >
                        {renderValue(attr, data[attr], idx)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
              
              {/* Bouton d'action */}
              <TableRow>
                <TableCell className="font-medium">Action</TableCell>
                {products.map(product => (
                  <TableCell key={`${product.id}-action`}>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.isSold}
                      className="w-full"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Ajouter au panier
                    </Button>
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <SheetFooter className="mt-4">
          <Button onClick={() => onOpenChange(false)} className="w-full">Fermer</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const FloatingCompareButton: React.FC<{
  count: number;
  onClick: () => void;
}> = ({ count, onClick }) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <Button
            onClick={onClick}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-6 rounded-full shadow-lg"
          >
            Comparer ({count})
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductComparison;
