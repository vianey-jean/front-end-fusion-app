
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Plus, 
  Minus, 
  Truck, 
  Shield, 
  RotateCcw,
  MessageCircle,
  GitCompare
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProductQuickActions from '@/components/ecommerce/ProductQuickActions';
import WishlistManager from '@/components/ecommerce/WishlistManager';
import LiveChatSupport from '@/components/ecommerce/LiveChatSupport';
import CustomerReviews from '@/components/ecommerce/CustomerReviews';
import SecurityBadges from '@/components/trust/SecurityBadges';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, loadingProducts, fetchProducts } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Sample data for components
  const [wishlistItems] = useState([
    {
      id: '1',
      productId: id || '1',
      name: 'Produit exemple',
      price: 29.99,
      originalPrice: 39.99,
      image: '/placeholder.svg',
      inStock: true,
      category: 'Électronique',
      rating: 4.5,
      priceChange: 'down' as const,
      addedDate: new Date().toISOString()
    }
  ]);

  const [reviews] = useState([
    {
      id: '1',
      userId: '1',
      userName: 'Marie Dubois',
      userAvatar: '/placeholder.svg',
      rating: 5,
      title: 'Excellent produit !',
      content: 'Je recommande vivement ce produit. La qualité est au rendez-vous et la livraison a été rapide.',
      images: ['/placeholder.svg'],
      date: new Date().toISOString(),
      verified: true,
      helpful: 12,
      notHelpful: 1,
      userVote: null
    },
    {
      id: '2',
      userId: '2',
      userName: 'Jean Martin',
      rating: 4,
      title: 'Très satisfait',
      content: 'Bon rapport qualité-prix. Quelques petits défauts mais rien de rédhibitoire.',
      date: new Date().toISOString(),
      verified: true,
      helpful: 8,
      notHelpful: 0,
      userVote: null
    }
  ]);

  useEffect(() => {
    const initializeProduct = async () => {
      setIsLoading(true);
      
      if (products.length === 0) {
        try {
          await fetchProducts();
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
      
      setIsLoading(false);
    };

    initializeProduct();
  }, [products, fetchProducts]);

  const product = products.find(p => p.id === id);

  if (isLoading || loadingProducts) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
          <p className="text-gray-600 mb-6">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate('/products')}>
            Retour aux produits
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} ajouté${quantity > 1 ? 's' : ''} au panier`);
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleAddToFavorites = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers');
    }
  };

  const productForQuickActions = {
    ...product,
    image: product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg',
    rating: 4.5,
    reviews: 123,
    isNew: false,
    isBestSeller: true,
    freeShipping: true,
    inStock: true
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">
            Accueil
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-blue-600">
            Produits
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg border overflow-hidden">
              <img
                src={product.image ? `${import.meta.env.VITE_API_BASE_URL}${product.image}` : '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.5) • 123 avis</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {product.price.toFixed(2)} €
                </span>
                {product.promotion && (
                  <Badge className="bg-red-600 text-white">
                    -{product.promotion}% de réduction
                  </Badge>
                )}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Quantité:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuantityChange(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button onClick={handleAddToCart} className="flex-1 h-12">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleAddToFavorites}
                  className={isLiked ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" onClick={() => setShowWishlist(true)}>
                  <GitCompare className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Truck className="h-5 w-5 text-green-600" />
                <span className="text-sm">Livraison gratuite</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Garantie 2 ans</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="text-sm">Retour sous 30 jours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges */}
        <div className="mb-12">
          <SecurityBadges variant="detailed" showStats={true} />
        </div>

        {/* Product Quick Actions Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Actions rapides du produit</h2>
          <div className="max-w-md">
            <ProductQuickActions 
              product={productForQuickActions}
              onAddToCart={() => toast.success('Produit ajouté au panier')}
              onAddToFavorites={() => toast.success('Ajouté aux favoris')}
              onQuickView={() => toast.info('Aperçu rapide ouvert')}
              onCompare={() => toast.success('Ajouté à la comparaison')}
              onShare={() => toast.success('Lien partagé')}
            />
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mb-12">
          <CustomerReviews
            productId={product.id}
            reviews={reviews}
            averageRating={4.5}
            totalReviews={123}
            onAddReview={(review) => toast.success('Avis ajouté avec succès !')}
            onVoteReview={(reviewId, vote) => toast.success('Vote enregistré !')}
          />
        </div>

        {/* Wishlist Manager Modal */}
        {showWishlist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Ma liste de souhaits</h2>
                <Button variant="outline" onClick={() => setShowWishlist(false)}>
                  Fermer
                </Button>
              </div>
              <div className="p-4">
                <WishlistManager
                  items={wishlistItems}
                  onRemoveItem={(id) => toast.success('Produit retiré de la liste')}
                  onAddToCart={(id) => toast.success('Produit ajouté au panier')}
                  onShareItem={(id) => toast.success('Lien partagé')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Live Chat Support */}
        <LiveChatSupport
          isOpen={showChat}
          onToggle={() => setShowChat(!showChat)}
        />

        {/* Chat Support Button */}
        {!showChat && (
          <Button
            onClick={() => setShowChat(true)}
            className="fixed bottom-4 left-4 z-40 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;
