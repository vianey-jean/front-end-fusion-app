import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Truck, Shield, CheckCircle, ArrowLeft, Lock, Package, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/hooks/use-toast';

const CheckoutPage = () => {
  const { selectedCartItems, clearSelectedCartItems } = useStore();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [billingInfo, setBillingInfo] = useState({
    firstName: user?.prenom || '',
    lastName: user?.nom || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });

  useEffect(() => {
    if (!isAuthenticated || !selectedCartItems || selectedCartItems.length === 0) {
      navigate('/cart');
    }
  }, [isAuthenticated, selectedCartItems, navigate]);

  if (!selectedCartItems || selectedCartItems.length === 0) {
    return null;
  }

  const subtotal = selectedCartItems.reduce((total, item) => {
    const price = item.product.prixPromo || item.product.prix || item.product.price;
    return total + (price * item.quantity);
  }, 0);

  const shippingCosts = {
    standard: subtotal >= 50 ? 0 : 4.90,
    express: 9.90,
    premium: 14.90
  };

  const shippingCost = shippingCosts[shippingMethod as keyof typeof shippingCosts];
  const total = subtotal + shippingCost;

  const handleInputChange = (field: string, value: string) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitOrder = async () => {
    setIsProcessing(true);
    
    try {
      // Simulation d'un processus de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici vous intégreriez votre API de paiement
      toast({
        title: "Commande validée",
        description: "Votre commande a été validée avec succès !",
      });
      clearSelectedCartItems();
      navigate('/order-confirmation');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors du traitement de la commande",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Livraison Standard',
      description: '3-5 jours ouvrables',
      price: shippingCosts.standard,
      icon: Package
    },
    {
      id: 'express',
      name: 'Livraison Express',
      description: '1-2 jours ouvrables',
      price: shippingCosts.express,
      icon: Truck
    },
    {
      id: 'premium',
      name: 'Livraison Premium',
      description: 'Livraison le lendemain',
      price: shippingCosts.premium,
      icon: CheckCircle
    }
  ];

  const paymentOptions = [
    {
      id: 'card',
      name: 'Carte bancaire',
      description: 'Visa, Mastercard, American Express',
      icon: CreditCard
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Paiement sécurisé via PayPal',
      icon: Shield
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button
              variant="outline"
              onClick={() => navigate('/cart')}
              className="mb-6 hover:bg-blue-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au panier
            </Button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Finaliser ma commande
              </h1>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                Dernière étape avant de recevoir vos produits préférés
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Billing Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-white" />
                      </div>
                      Informations de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={billingInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="mt-1 h-12 bg-white/50 dark:bg-neutral-800/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={billingInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="mt-1 h-12 bg-white/50 dark:bg-neutral-800/50"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={billingInfo.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="mt-1 h-12 bg-white/50 dark:bg-neutral-800/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={billingInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="mt-1 h-12 bg-white/50 dark:bg-neutral-800/50"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={billingInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="mt-1 h-12 bg-white/50 dark:bg-neutral-800/50"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={billingInfo.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="mt-1 h-12 bg-white/50 dark:bg-neutral-800/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          value={billingInfo.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          className="mt-1 h-12 bg-white/50 dark:bg-neutral-800/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Pays</Label>
                        <Input
                          id="country"
                          value={billingInfo.country}
                          disabled
                          className="mt-1 h-12 bg-neutral-100 dark:bg-neutral-700"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Shipping Method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      Mode de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                      <div className="space-y-4">
                        {shippingOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <div key={option.id} className="flex items-center space-x-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 rounded-lg flex items-center justify-center">
                                  <IconComponent className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <div className="flex-1">
                                  <Label htmlFor={option.id} className="font-medium cursor-pointer">
                                    {option.name}
                                  </Label>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {option.description}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="font-semibold">
                                    {option.price === 0 ? 'Gratuit' : `${option.price.toFixed(2)} €`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <Lock className="h-4 w-4 text-white" />
                      </div>
                      Mode de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-4">
                        {paymentOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <div key={option.id} className="flex items-center space-x-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-700 dark:to-neutral-600 rounded-lg flex items-center justify-center">
                                  <IconComponent className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                                </div>
                                <div>
                                  <Label htmlFor={option.id} className="font-medium cursor-pointer">
                                    {option.name}
                                  </Label>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl">Résumé de commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Items */}
                  <div className="space-y-4">
                    {selectedCartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-3 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Quantité: {item.quantity}
                          </p>
                          <p className="font-semibold text-sm">
                            {(((item.product.prixPromo || item.product.prix || item.product.price)) * item.quantity).toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Summary */}
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Livraison</span>
                      <span>{shippingCost === 0 ? 'Gratuit' : `${shippingCost.toFixed(2)} €`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm font-medium">Paiement 100% sécurisé</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-medium"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Traitement en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Finaliser la commande
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
