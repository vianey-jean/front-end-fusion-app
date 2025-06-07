import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, ShoppingCart, Check, Truck, ArrowLeft, Share2, Shield, Clock, Star, Award, Package } from 'lucide-react';
import FeaturedProductsSlider from '@/components/products/FeaturedProductsSlider';
import ProductReviews from '@/components/reviews/ProductReviews';
import { getRealId, isValidSecureId, getEntityType } from '@/services/secureIds';
import { toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetail = () => {
  const { productId: secureProductId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleFavorite, isFavorite } = useStore();
  const { isAuthenticated } = useAuth();
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const PLACEHOLDER_IMAGE = '/placeholder.svg';
  
  console.log('ProductDetail - Secure ID:', secureProductId);
  
  const productId = secureProductId ? getRealId(secureProductId) : undefined;
  
  console.log('ProductDetail - Real ID:', productId);
  
  const [product, setProduct] = useState(products.find(p => p.id === productId));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isValidId, setIsValidId] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    
    if (!secureProductId) {
      setIsValidId(false);
      toast.error("Produit non trouvé");
      navigate('/page/notfound', { replace: true });
      return;
    }
    
    const isValid = isValidSecureId(secureProductId);
    const entityType = getEntityType(secureProductId);
    
    console.log('ProductDetail - Validation:', { isValid, entityType, productId });
    
    if (!isValid) {
      setIsValidId(false);
      toast.error("Ce lien n'est plus valide");
      navigate('/page/notfound', { replace: true });
    } else {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setIsValidId(true);
      } else {
        console.log('ProductDetail - Produit non trouvé:', productId);
        setIsValidId(false);
        toast.error("Produit introuvable");
        navigate('/page/notfound', { replace: true });
      }
    }
    
    setIsLoading(false);
  }, [secureProductId, productId, products, navigate]);

  useEffect(() => {
    if (product && product.promotion && product.promotionEnd) {
      const updateRemainingTime = () => {
        const end = new Date(product.promotionEnd!);
        const now = new Date();
        const diffInMs = end.getTime() - now.getTime();
        
        if (diffInMs <= 0) {
          setRemainingTime("Promotion expirée");
          return;
        }
        
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffInMins = Math.floor((diffInMs % (1000 * 60)) / (1000 * 60));
        const diffInSecs = Math.floor((diffInMs % (1000 * 60)) / 1000);

        if (diffInDays > 0) {
          setRemainingTime(`${diffInDays}j ${diffInHours}h ${diffInMins}m ${diffInSecs}s`);
        } else {
          setRemainingTime(`${diffInHours}h ${diffInMins}m ${diffInSecs}s`);
        }
      };
      
      updateRemainingTime();
      const interval = setInterval(updateRemainingTime, 1000);
      
      return () => clearInterval(interval);
    }
  }, [product]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && (product?.stock === undefined || newQuantity <= product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier", {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }

    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      setAddedToCart(true);
      toast.success(`${quantity} ${quantity > 1 ? 'exemplaires' : 'exemplaire'} ajouté${quantity > 1 ? 's' : ''} au panier`);
      
      setTimeout(() => {
        setAddedToCart(false);
      }, 2000);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1">
                <Skeleton className="w-full h-[500px] rounded-2xl mb-4" />
                <div className="flex justify-center space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-xl" />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <Skeleton className="w-3/4 h-8 mb-3" />
                <Skeleton className="w-1/2 h-6 mb-6" />
                <Skeleton className="w-1/4 h-5 mb-8" />
                <Skeleton className="w-full h-32 mb-6" />
                <div className="flex space-x-4">
                  <Skeleton className="w-1/3 h-12" />
                  <Skeleton className="w-1/3 h-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isValidId || !product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex items-center justify-center">
          <div className="text-center p-8">
            <div className="mb-6">
              <Package className="h-24 w-24 text-neutral-400 mx-auto mb-4" />
            </div>
            <h1 className="text-3xl font-bold mb-6 text-neutral-800 dark:text-neutral-200">Produit non trouvé</h1>
            <p className="mb-8 text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
              Le produit que vous recherchez n'existe pas ou a été supprimé.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <a href="/">Retour à l'accueil</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedProducts = products
    .filter(p => p.category === product?.category && p.id !== product?.id)
    .slice(0, 8);

  const isProductFavorite = productId ? isFavorite(productId) : false;
  const isPromotionActive = product?.promotion && 
    product?.promotionEnd && 
    new Date(product.promotionEnd) > new Date();
  const isInStock = product?.isSold && (product?.stock === undefined || product.stock > 0);

  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
        
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return PLACEHOLDER_IMAGE;
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${AUTH_BASE_URL}${imagePath}`;
  };

  const features = [
    { icon: <Shield className="h-5 w-5" />, text: "Produit authentique garanti" },
    { icon: <Truck className="h-5 w-5" />, text: "Livraison rapide et sécurisée" },
    { icon: <Award className="h-5 w-5" />, text: "Satisfaction client garantie" }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-blue-950/30">
        <div className="container mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-blue-50 dark:hover:bg-blue-950/20" 
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1"
            >
              <div className="mb-6 relative bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={getImageUrl(productImages[selectedImageIndex])}
                    alt={product.name}
                    className="w-full h-[500px] object-contain rounded-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </AnimatePresence>
                
                {isPromotionActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-6 right-6 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                  >
                    -{product.promotion}%
                  </motion.div>
                )}
              </div>

              {productImages.length > 1 && (
                <div className="flex justify-center flex-wrap gap-3">
                  {productImages.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-20 h-20 overflow-hidden rounded-xl cursor-pointer border-2 transition-all shadow-md ${
                        index === selectedImageIndex 
                          ? 'border-blue-500 shadow-blue-200 dark:shadow-blue-900/50' 
                          : 'border-transparent hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={`${product.name} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex-1"
            >
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                {/* Badges */}
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
                    {product.category}
                  </Badge>
                  {product.dateAjout && new Date().getTime() - new Date(product.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000 && (
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Nouveau
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 leading-tight">
                  {product.name}
                </h1>
                
                {/* Pricing */}
                {isPromotionActive ? (
                  <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-4 mb-3">
                      <p className="text-2xl text-neutral-500 line-through">
                        {typeof product.originalPrice === 'number'
                          ? product.originalPrice.toFixed(2)
                          : product.price.toFixed(2)}{' '}
                        €
                      </p>
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-sm font-bold rounded-full shadow-lg">
                        -{product.promotion}%
                      </span>
                    </div>
                    <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                      {product.price.toFixed(2)} €
                    </p>
                    {remainingTime && (
                      <div className="mt-4 flex items-center text-sm bg-white/50 dark:bg-neutral-800/50 p-3 rounded-lg">
                        <Clock className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                        <span className="font-medium">
                          Promotion se termine dans: <span className="font-bold text-red-600 dark:text-red-400">{remainingTime}</span>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {product.price.toFixed(2)} €
                  </p>
                )}

                {/* Features */}
                <div className="grid gap-3 mb-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg"
                    >
                      <div className="text-blue-600 dark:text-blue-400">
                        {feature.icon}
                      </div>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-6">
                  {isInStock && (
                    <div className="flex items-center gap-4">
                      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Quantité:
                      </label>
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-4 py-2 bg-white dark:bg-neutral-900 min-w-[50px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          className="px-3 py-2 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          disabled={product.stock !== undefined && quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    {isInStock ? (
                      <Button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-12"
                        disabled={addedToCart}
                      >
                        {addedToCart ? (
                          <>
                            <Check className="mr-2 h-5 w-5" />
                            Ajouté !
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Ajouter au panier
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="flex-1 bg-gradient-to-r from-neutral-400 to-neutral-500 text-white text-center py-3 rounded-lg">
                        Rupture de stock
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => product && toggleFavorite(product)}
                      className={`h-12 w-12 border-2 transition-all duration-300 ${
                        isProductFavorite 
                          ? 'border-red-300 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30' 
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/20'
                      }`}
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors ${
                          isProductFavorite ? 'text-red-500 fill-red-500' : 'text-neutral-400'
                        }`} 
                      />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tabs for detailed info */}
              <div className="mt-8">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border border-neutral-200 dark:border-neutral-700 shadow-lg">
                    <TabsTrigger value="description" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Description
                    </TabsTrigger>
                    <TabsTrigger value="features" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Caractéristiques
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      Avis
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-6">
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6 border border-neutral-200/50 dark:border-neutral-700/50">
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {product.description || "Aucune description disponible pour ce produit."}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="mt-6">
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl p-6 border border-neutral-200/50 dark:border-neutral-700/50">
                      <div className="grid gap-4">
                        <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                          <span className="font-medium">Catégorie</span>
                          <span className="text-neutral-600 dark:text-neutral-400">{product.category}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                          <span className="font-medium">Prix</span>
                          <span className="text-neutral-600 dark:text-neutral-400">{product.price.toFixed(2)} €</span>
                        </div>
                        {product.stock !== undefined && (
                          <div className="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700">
                            <span className="font-medium">Stock</span>
                            <span className="text-neutral-600 dark:text-neutral-400">{product.stock} disponible{product.stock > 1 ? 's' : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-6">
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 overflow-hidden">
                      {productId && <ProductReviews productId={productId} />}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
          
          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16"
            >
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
                Produits similaires
              </h2>
              <FeaturedProductsSlider 
                products={relatedProducts} 
                title="Produits similaires"
                slidesToShow={4}
              />
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
