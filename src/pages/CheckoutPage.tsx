import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/components/ui/sonner';
import CreditCardForm from '@/components/checkout/CreditCardForm';
import { ShippingAddress, codePromosAPI } from '@/services/api';
import { Link } from 'react-router-dom';
import { Percent, ShoppingCart, MapPin, Phone, User, CreditCard, Shield, CheckCircle, Truck } from 'lucide-react';
import PaymentMethods from '@/components/checkout/PaymentMethods';
import CartSummary from '@/components/cart/CartSummary';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';

// Définition des prix de livraison par ville
const DELIVERY_PRICES = {
  "Saint-Benoît": 20,
  "Saint-Denis": 0,
  "Saint-Pierre": 20,
  "Bras-Panon": 25,
  "Entre-Deux": 20,
  "Etang-Salé": 25,
  "Petite-Île": 20,
  "Le Port": 0,
  "La Possession": 0,
  "Saint-André": 10,
  "Saint Joseph": 25,
  "Saint-Leu": 15,
  "Saint-Louis": 15,
  "Saint-Paul": 0,
  "Saint-Philippe": 25,
  "Sainte-Marie": 0,
  "Sainte-Rose": 25,
  "Sainte-Suzanne": 0,
  "Salazie": 25,
  "Tampon": 20,
  "Trois-Bassins": 20
};

const CheckoutPage = () => {
  const { selectedCartItems, getCartTotal, createOrder } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showCardForm, setShowCardForm] = useState(false);
  const [deliveryCity, setDeliveryCity] = useState<string>("");
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  
  // État pour le code promo
  const [codePromo, setCodePromo] = useState<string>('');
  const [verifyingCode, setVerifyingCode] = useState<boolean>(false);
  const [verifiedPromo, setVerifiedPromo] = useState<{
    valid: boolean;
    pourcentage: number;
    productId: string;
    code: string;
  } | null>(null);
  
  // Formulaire d'adresse
  const [shippingData, setShippingData] = useState<ShippingAddress>({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    adresse: user?.adresse || '',
    ville: user?.ville || '',
    codePostal: user?.codePostal || '',
    pays: user?.pays || 'La Réunion',
    telephone: user?.telephone || '',
  });
  
  // Vérifier si tous les produits sont en promotion
  const allProductsOnPromotion = selectedCartItems.every(item => 
    item.product.promotion && item.product.promotion > 0
  );
  
  // Vérifier s'il y a au moins un produit sans promotion
  const hasNonPromotionProduct = selectedCartItems.some(item => 
    !item.product.promotion || item.product.promotion <= 0
  );

  useEffect(() => {
    // Rediriger si le panier est vide
    if (selectedCartItems.length === 0) {
      toast.error("Votre panier est vide. Veuillez ajouter des produits avant de procéder au paiement.");
      navigate('/panier');
    }
  }, [selectedCartItems, navigate]);
  
  // Si les items du panier changent, mettre à jour les informations de livraison
  useEffect(() => {
    if (user) {
      setShippingData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        adresse: user.adresse || '',
        ville: user.ville || '',
        codePostal: user.codePostal || '',
        pays: user.pays || 'La Réunion',
        telephone: user.telephone || '',
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingData(prev => ({ ...prev, [name]: value }));
  };

  // Mettre à jour la ville et le prix de livraison
  const handleCityChange = (city: string) => {
    setDeliveryCity(city);
    setShippingData(prev => ({ ...prev, ville: city }));
    
    const price = DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES] || 0;
    setDeliveryPrice(price);
  };
  
  // Vérifier le code promo
  const handleVerifyCodePromo = async () => {
    if (!codePromo.trim()) {
      toast.error("Veuillez saisir un code promo");
      return;
    }
    
    // Rechercher le premier produit sans promotion pour appliquer le code promo
    const nonPromoProduct = selectedCartItems.find(item => 
      !item.product.promotion || item.product.promotion <= 0
    );
    
    if (!nonPromoProduct) {
      toast.error("Aucun produit éligible pour un code promo");
      return;
    }
    
    setVerifyingCode(true);
    try {
      const response = await codePromosAPI.verify(codePromo, nonPromoProduct.product.id);
      const data = response.data;
      
      if (data.valid && data.pourcentage) {
        setVerifiedPromo({
          valid: true,
          pourcentage: data.pourcentage,
          productId: nonPromoProduct.product.id,
          code: codePromo
        });
        toast.success(`Code promo valide ! ${data.pourcentage}% de réduction appliquée`);
      } else {
        setVerifiedPromo(null);
        toast.error(data.message || "Code promo invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du code promo:", error);
      setVerifiedPromo(null);
      toast.error("Erreur lors de la vérification du code promo");
    } finally {
      setVerifyingCode(false);
    }
  };
  
  const handleShippingSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateShippingForm()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!deliveryCity) {
      toast.error("Veuillez sélectionner une ville de livraison");
      return;
    }

    // Passer à l'étape suivante
    setStep('payment');
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (paymentMethod === 'card') {
      setShowCardForm(true);
    } else {
      // Traiter les autres méthodes de paiement
      processOrder();
    }
  };
  
  const processOrder = async () => {
    setLoading(true);
    try {
      console.log('Traitement de commande avec données:', {
        shippingAddress: shippingData,
        paymentMethod: paymentMethod,
        cartItems: selectedCartItems.map(item => ({ 
          productId: item.product.id, 
          quantity: item.quantity 
        })),
        promoDetails: verifiedPromo ? {
          code: verifiedPromo.code,
          productId: verifiedPromo.productId,
          pourcentage: verifiedPromo.pourcentage
        } : undefined
      });
      
      // Ensure we're actually sending items to the server
      if (selectedCartItems.length === 0) {
        toast.error("Votre panier est vide. Impossible de créer la commande.");
        setLoading(false);
        return;
      }
      
      const order = await createOrder(
        shippingData, 
        paymentMethod, 
        verifiedPromo ? {
          code: verifiedPromo.code,
          productId: verifiedPromo.productId,
          pourcentage: verifiedPromo.pourcentage
        } : undefined
      );
      
      if (order) {
        toast.success("Commande effectuée avec succès !");
        navigate(`/commandes`);  // Redirect to orders page
      } else {
        toast.error("Erreur lors de la création de la commande");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Une erreur est survenue lors de la validation de la commande");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    console.log("Payment success, processing order...");
    processOrder();
  };
  
  const validateShippingForm = () => {
    return (
      shippingData.nom.trim() !== '' &&
      shippingData.prenom.trim() !== '' &&
      shippingData.adresse.trim() !== '' &&
      deliveryCity !== '' &&
      shippingData.codePostal.trim() !== '' &&
      shippingData.pays.trim() !== '' &&
      shippingData.telephone.trim() !== ''
    );
  };
  
  // Calculer le total en tenant compte du code promo
  const calculateItemPrice = (item: typeof selectedCartItems[0]) => {
    if (verifiedPromo && verifiedPromo.valid && item.product.id === verifiedPromo.productId) {
      return item.product.price * (1 - verifiedPromo.pourcentage / 100) * item.quantity;
    }
    return item.product.price * item.quantity;
  };
  
  const subtotal = getCartTotal();
  
  // Calculer le total avec remise code promo
  const discountedSubtotal = selectedCartItems.reduce((total, item) => {
    return total + calculateItemPrice(item);
  }, 0);
  
  const hasPromoDiscount = subtotal !== discountedSubtotal;
  const orderTotal = discountedSubtotal + deliveryPrice;
  
  // URL de base pour les images
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  // Si aucun élément n'est sélectionné, retourner au panier
  if (selectedCartItems.length === 0) {
    return (
      <Layout>
        <motion.div 
          className="max-w-4xl mx-auto px-4 py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 rounded-3xl p-12 shadow-xl border border-gray-200 dark:border-gray-700"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-6" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-600 to-blue-600 bg-clip-text text-transparent">Votre panier est vide</h1>
            <p className="text-gray-500 mb-8 text-lg">Ajoutez des produits à votre panier pour commander</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Link to="/panier">Retour au panier</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Layout>
    );
  }
  
  if (loading) {
    return (
      <Layout>
        <motion.div 
          className="max-w-4xl mx-auto px-4 py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl">
            <LoadingSpinner size="lg" text="Traitement de votre commande..." />
          </div>
        </motion.div>
      </Layout>
    );
  }
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const stepVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <Layout>
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Finaliser la commande
            </h1>
          </motion.div>
          
          {/* Étapes du processus d'achat */}
          <motion.div className="mb-12" variants={itemVariants}>
            <div className="flex justify-between items-center max-w-md mx-auto">
              <motion.div 
                className={`flex-1 text-center transition-all duration-500 ${step === 'shipping' ? 'font-semibold' : ''}`}
                variants={stepVariants}
              >
                <motion.div 
                  className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step === 'shipping' 
                      ? 'bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Truck className="h-5 w-5" />
                </motion.div>
                <span className="text-sm font-medium">Livraison</span>
              </motion.div>
              
              <div className="w-1/3 h-2 bg-gray-200 rounded-full mx-4 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: step === 'payment' ? "100%" : "0%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
              
              <motion.div 
                className={`flex-1 text-center transition-all duration-500 ${step === 'payment' ? 'font-semibold' : ''}`}
                variants={stepVariants}
              >
                <motion.div 
                  className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-500 ${
                    step === 'payment' 
                      ? 'bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-lg scale-110' 
                      : 'bg-gray-200 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CreditCard className="h-5 w-5" />
                </motion.div>
                <span className="text-sm font-medium">Paiement</span>
              </motion.div>
            </div>
          </motion.div>
          
          {showCardForm ? (
            <motion.div 
              className="max-w-md mx-auto bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20 p-8 rounded-3xl shadow-2xl border border-blue-100 dark:border-blue-800/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Paiement sécurisé
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Vos informations sont protégées</p>
              </div>
              <CreditCardForm onSuccess={handlePaymentSuccess} />
              <Button 
                variant="outline" 
                className="mt-6 w-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                onClick={() => setShowCardForm(false)}
              >
                Retour aux options de paiement
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div className="lg:col-span-8 space-y-8" variants={itemVariants}>
                {step === 'shipping' && (
                  <motion.form 
                    onSubmit={handleShippingSubmit}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <div className="bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-blue-900/20 p-8 rounded-3xl shadow-xl border border-blue-100 dark:border-blue-800/20">
                      <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Informations de livraison
                        </h2>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="nom" className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4 text-blue-500" />
                            Nom*
                          </Label>
                          <Input
                            id="nom"
                            name="nom"
                            value={shippingData.nom}
                            onChange={handleChange}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prenom" className="flex items-center gap-2 font-medium">
                            <User className="h-4 w-4 text-blue-500" />
                            Prénom*
                          </Label>
                          <Input
                            id="prenom"
                            name="prenom"
                            value={shippingData.prenom}
                            onChange={handleChange}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6 space-y-2">
                        <Label htmlFor="adresse" className="flex items-center gap-2 font-medium">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          Adresse*
                        </Label>
                        <Input
                          id="adresse"
                          name="adresse"
                          value={shippingData.adresse}
                          onChange={handleChange}
                          required
                          className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="ville" className="flex items-center gap-2 font-medium">
                            <Truck className="h-4 w-4 text-blue-500" />
                            Ville de livraison*
                          </Label>
                          <Select 
                            value={deliveryCity}
                            onValueChange={handleCityChange}
                          >
                            <SelectTrigger id="ville" className="border-blue-200 focus:border-blue-500 rounded-xl">
                              <SelectValue placeholder="Sélectionnez une ville" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(DELIVERY_PRICES).sort().map(city => (
                                <SelectItem key={city} value={city}>
                                  {city} {DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES] === 0 
                                    ? "(Gratuit)" 
                                    : `(+${DELIVERY_PRICES[city as keyof typeof DELIVERY_PRICES]}€)`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="codePostal" className="flex items-center gap-2 font-medium">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            Code postal*
                          </Label>
                          <Input
                            id="codePostal"
                            name="codePostal"
                            value={shippingData.codePostal}
                            onChange={handleChange}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="pays" className="flex items-center gap-2 font-medium">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            Pays*
                          </Label>
                          <Select 
                            value={shippingData.pays}
                            onValueChange={(value) => setShippingData({...shippingData, pays: value})}
                          >
                            <SelectTrigger id="pays" className="border-blue-200 focus:border-blue-500 rounded-xl">
                              <SelectValue placeholder="Sélectionnez un pays" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="La Réunion">La Réunion</SelectItem>
                              <SelectItem value="France">France</SelectItem>
                              <SelectItem value="Madagascar">Madagascar</SelectItem>
                              <SelectItem value="Mayotte">Mayotte</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telephone" className="flex items-center gap-2 font-medium">
                            <Phone className="h-4 w-4 text-blue-500" />
                            Téléphone*
                          </Label>
                          <Input
                            id="telephone"
                            name="telephone"
                            type="tel"
                            value={shippingData.telephone}
                            onChange={handleChange}
                            required
                            className="border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => navigate('/panier')}
                        className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        Retour au panier
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Continuer au paiement
                      </Button>
                    </div>
                  </motion.form>
                )}
                
                {step === 'payment' && (
                  <motion.form 
                    onSubmit={handlePaymentSubmit}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <PaymentMethods 
                      selectedMethod={paymentMethod}
                      onMethodChange={setPaymentMethod}
                    />
                    
                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setStep('shipping')}
                        className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        Retour
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        disabled={loading}
                      >
                        {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                      </Button>
                    </div>
                  </motion.form>
                )}
              </motion.div>
              
              <motion.div className="lg:col-span-4" variants={itemVariants}>
                <div className="bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 p-6 rounded-3xl shadow-xl border border-purple-100 dark:border-purple-800/20 mb-6 sticky top-6">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Récapitulatif
                    </h2>
                  </div>
                  
                  {/* ... keep existing code (product items display) */}
                  
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex justify-between text-lg">
                      <p>Sous-total</p>
                      <p className="font-semibold">{formatPrice(subtotal)}</p>
                    </div>
                    
                    {hasPromoDiscount && (
                      <div className="flex justify-between text-green-600">
                        <p>Remise code promo</p>
                        <p className="font-semibold">-{formatPrice(subtotal - discountedSubtotal)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg">
                      <p>Frais de livraison ({deliveryCity || 'Non sélectionné'})</p>
                      <p className="font-semibold">{deliveryPrice === 0 && !deliveryCity ? 'Non calculé' : deliveryPrice === 0 ? 'Gratuit' : formatPrice(deliveryPrice)}</p>
                    </div>
                    
                    {/* Section Code Promo */}
                    {step === 'shipping' && !allProductsOnPromotion && hasNonPromotionProduct && (
                      <div className="py-4 border-t border-b bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4">
                        <p className="font-semibold mb-3 flex items-center gap-2">
                          <Percent className="h-4 w-4 text-yellow-600" />
                          Code Promotion
                        </p>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Saisir votre code promo"
                            value={codePromo}
                            onChange={(e) => setCodePromo(e.target.value)}
                            disabled={verifiedPromo !== null || verifyingCode}
                            className="flex-1 border-yellow-200 focus:border-yellow-500 rounded-xl"
                          />
                          <Button 
                            onClick={handleVerifyCodePromo}
                            disabled={!codePromo || verifiedPromo !== null || verifyingCode}
                            variant="outline"
                            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-xl"
                          >
                            {verifyingCode ? 'Vérification...' : 'Appliquer'}
                          </Button>
                        </div>
                        {verifiedPromo && verifiedPromo.valid && (
                          <div className="mt-3 flex items-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Code promo appliqué : {verifiedPromo.pourcentage}% de réduction
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between font-bold text-xl pt-4 border-t-2 border-purple-200 dark:border-purple-700">
                      <p>Total</p>
                      <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {formatPrice(orderTotal)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800/20"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center mb-3">
                    <Shield className="h-5 w-5 text-green-600 mr-2" />
                    <h3 className="font-semibold text-green-800 dark:text-green-400">Informations sur la livraison</h3>
                  </div>
                  <ul className="text-sm space-y-2 text-green-700 dark:text-green-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Livraison gratuite à partir de 50€ d'achat
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Les frais de livraison varient selon la ville
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Livraison en 3-5 jours ouvrés
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Retours gratuits sous 30 jours
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3" />
                      Paiements sécurisés
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
};

export default CheckoutPage;
