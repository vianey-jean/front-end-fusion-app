import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  Trash2, 
  Search,
  Filter,
  Grid,
  List,
  Star,
  TrendingUp,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  category: string;
  rating?: number;
  priceChange?: 'up' | 'down' | 'stable';
  addedDate: string;
}

interface WishlistManagerProps {
  items: WishlistItem[];
  onRemoveItem: (itemId: string) => void;
  onAddToCart: (productId: string) => void;
  onShareItem: (productId: string) => void;
}

const WishlistManager: React.FC<WishlistManagerProps> = ({
  items,
  onRemoveItem,
  onAddToCart,
  onShareItem
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'name'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'inStock' | 'onSale'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>(items);

  useEffect(() => {
    let filtered = [...items];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    switch (filterBy) {
      case 'inStock':
        filtered = filtered.filter(item => item.inStock);
        break;
      case 'onSale':
        filtered = filtered.filter(item => item.originalPrice && item.originalPrice > item.price);
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
        default:
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
      }
    });

    setFilteredItems(filtered);
  }, [items, searchTerm, sortBy, filterBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const getPriceChangeIcon = (change?: 'up' | 'down' | 'stable') => {
    switch (change) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
      default:
        return null;
    }
  };

  const handleAddToCart = (productId: string, itemName: string) => {
    onAddToCart(productId);
    toast.success(`${itemName} ajouté au panier`);
  };

  const handleRemoveItem = (itemId: string, itemName: string) => {
    onRemoveItem(itemId);
    toast.success(`${itemName} retiré de la liste de souhaits`);
  };

  const handleShareItem = (productId: string) => {
    onShareItem(productId);
    toast.success('Lien partagé');
  };

  const WishlistItemCard = ({ item, isListView = false }: { item: WishlistItem; isListView?: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={isListView ? "w-full" : ""}
    >
      <Card className={`group hover:shadow-lg transition-all duration-300 ${isListView ? 'w-full' : ''}`}>
        <CardContent className={`p-4 ${isListView ? 'flex items-center space-x-4' : ''}`}>
          {/* Image */}
          <div className={`relative ${isListView ? 'w-24 h-24 flex-shrink-0' : 'w-full h-48 mb-4'}`}>
            <img 
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
            
            {/* Stock Status */}
            {!item.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <Badge variant="destructive">Rupture</Badge>
              </div>
            )}

            {/* Sale Badge */}
            {item.originalPrice && item.originalPrice > item.price && (
              <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                <Gift className="h-3 w-3 mr-1" />
                Promo
              </Badge>
            )}

            {/* Quick Actions */}
            <div className={`absolute top-2 right-2 ${isListView ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleShareItem(item.productId)}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <Share2 className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="bg-white/90 backdrop-blur-sm text-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`${isListView ? 'flex-1' : ''}`}>
            <div className={`${isListView ? 'flex items-start justify-between' : 'space-y-2'}`}>
              <div className={`${isListView ? 'flex-1 pr-4' : ''}`}>
                <h3 className={`font-semibold ${isListView ? 'text-lg' : 'text-base'} line-clamp-2`}>
                  {item.name}
                </h3>
                
                <p className="text-sm text-gray-600">{item.category}</p>

                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(item.rating!)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({item.rating})</span>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-lg font-bold">{formatPrice(item.price)}</span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  )}
                  {getPriceChangeIcon(item.priceChange)}
                </div>

                {/* Added Date */}
                <p className="text-xs text-gray-500 mt-1">
                  Ajouté le {new Date(item.addedDate).toLocaleDateString('fr-FR')}
                </p>
              </div>

              {/* Actions */}
              <div className={`${isListView ? 'flex flex-col space-y-2' : 'mt-4 space-y-2'}`}>
                <Button
                  onClick={() => handleAddToCart(item.productId, item.name)}
                  disabled={!item.inStock}
                  className={`${isListView ? 'px-6' : 'w-full'} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {item.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                </Button>

                {!isListView && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareItem(item.productId)}
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="h-6 w-6 mr-2 text-red-500 fill-current" />
              Ma liste de souhaits ({items.length})
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher dans ma liste..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="date">Trier par date</option>
              <option value="price">Trier par prix</option>
              <option value="name">Trier par nom</option>
            </select>

            {/* Filter */}
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="all">Tous les articles</option>
              <option value="inStock">En stock uniquement</option>
              <option value="onSale">En promotion</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Items */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
            <p className="text-gray-600">
              {searchTerm || filterBy !== 'all' 
                ? 'Essayez de modifier vos filtres de recherche.'
                : 'Votre liste de souhaits est vide. Commencez à ajouter vos produits préférés !'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          <AnimatePresence>
            {filteredItems.map((item) => (
              <WishlistItemCard 
                key={item.id} 
                item={item} 
                isListView={viewMode === 'list'} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default WishlistManager;