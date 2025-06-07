
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import CartSummary from '@/components/cart/CartSummary';
import CartItemCard from '@/components/cart/CartItemCard';
import EmptyCartMessage from '@/components/cart/EmptyCartMessage';
import { ShoppingCart, Sparkles, Shield, Truck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    loadingCart, 
    setSelectedCartItems 
  } = useStore();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (cart && cart.length > 0) {
      const initialSelection = cart.reduce((acc, item) => {
        acc[item.product.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setSelectedItems(initialSelection);
    }
  }, [cart]);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSelectItem = (productId: string, checked: boolean) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: checked
    }));
  };

  const handleCheckout = () => {
    const selectedProducts = cart.filter(item => selectedItems[item.product.id]);
    setSelectedCartItems(selectedProducts);
    navigate('/paiement');
  };

  if (loadingCart) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center mb-6"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                  <ShoppingCart className="h-12 w-12 text-white" />
                </div>
              </motion.div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-8">
                Votre Panier
              </h1>
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Chargement de votre panier..." />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-xl">
                  <ShoppingCart className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Votre Panier
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Finalisez votre sélection et procédez au paiement en toute sécurité
            </p>
          </motion.div>

          {!isAuthenticated || !cart || cart.length === 0 ? (
            <EmptyCartMessage isAuthenticated={isAuthenticated} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                        Articles dans votre panier
                      </h2>
                      <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {cart.length} article{cart.length > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {cart.map((item, index) => (
                        <motion.div
                          key={item.product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <CartItemCard
                            item={item}
                            isSelected={selectedItems[item.product.id] || false}
                            onSelectItem={handleSelectItem}
                            onQuantityChange={handleQuantityChange}
                            onRemove={removeFromCart}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex justify-end">
                      <Button 
                        variant="outline" 
                        className="text-sm hover:bg-blue-50 transition-colors"
                        onClick={() => {
                          const allSelected = cart.every(item => selectedItems[item.product.id]);
                          const newSelection = cart.reduce((acc, item) => {
                            acc[item.product.id] = !allSelected;
                            return acc;
                          }, {} as Record<string, boolean>);
                          setSelectedItems(newSelection);
                        }}
                      >
                        {cart.every(item => selectedItems[item.product.id]) 
                          ? "Désélectionner tout" 
                          : "Sélectionner tout"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                {/* Security & Shipping Info */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-green-800 dark:text-green-200">Paiement sécurisé</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">Vos données sont protégées</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-800 dark:text-blue-200">Livraison gratuite</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400">Dès 50€ d'achat</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="sticky top-8"
                >
                  <CartSummary 
                    onCheckout={handleCheckout}
                    selectedItems={selectedItems}
                  />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
