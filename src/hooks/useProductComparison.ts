
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useToast } from '@/hooks/use-toast';

export const useProductComparison = (maxProducts = 4) => {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedComparison = localStorage.getItem('product_comparison');
    if (savedComparison) {
      try {
        const parsed = JSON.parse(savedComparison);
        setComparisonProducts(parsed);
      } catch (error) {
        console.error('Failed to parse saved comparison products', error);
      }
    }
  }, []);

  useEffect(() => {
    if (comparisonProducts.length > 0) {
      localStorage.setItem('product_comparison', JSON.stringify(comparisonProducts));
    } else {
      localStorage.removeItem('product_comparison');
    }
  }, [comparisonProducts]);

  const addToComparison = (product: Product) => {
    if (comparisonProducts.some(p => p.id === product.id)) {
      toast({
        title: 'Produit déjà ajouté',
        description: 'Ce produit est déjà dans votre liste de comparaison.',
      });
      return false;
    }

    if (comparisonProducts.length >= maxProducts) {
      toast({
        title: 'Maximum atteint',
        description: `Vous ne pouvez comparer que ${maxProducts} produits à la fois.`,
      });
      return false;
    }

    setComparisonProducts(prevProducts => [...prevProducts, product]);
    toast({
      title: 'Produit ajouté',
      description: 'Produit ajouté à la comparaison.',
    });
    return true;
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts(prevProducts => 
      prevProducts.filter(p => p.id !== productId)
    );
  };

  const clearComparison = () => {
    setComparisonProducts([]);
    localStorage.removeItem('product_comparison');
  };

  const toggleComparePanel = () => {
    setIsCompareOpen(prev => !prev);
  };

  return {
    comparisonProducts,
    isCompareOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparePanel,
    setIsCompareOpen,
  };
};
