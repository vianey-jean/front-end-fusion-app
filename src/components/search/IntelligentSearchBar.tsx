
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/services/api';
import { Product } from '@/types/product';
import { Link, useNavigate } from 'react-router-dom';
import { getSecureProductId } from '@/services/secureIds';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestion {
  type: 'product' | 'category' | 'recent';
  title: string;
  subtitle?: string;
  id?: string;
  category?: string;
  price?: number;
  image?: string;
}

interface IntelligentSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

const IntelligentSearchBar: React.FC<IntelligentSearchBarProps> = ({
  placeholder = "Rechercher des produits...",
  onSearch,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await productsAPI.getAll();
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendingProducts = [] } = useQuery({
    queryKey: ['trending-products'],
    queryFn: async () => {
      const response = await productsAPI.getMostFavorited();
      return response.data || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const productSuggestions: SearchSuggestion[] = products
        .filter(product => 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
        .map(product => ({
          type: 'product',
          title: product.name,
          subtitle: product.category,
          id: product.id,
          price: product.price,
          image: product.image
        }));

      const categorySuggestions: SearchSuggestion[] = [
        ...new Set(products.map(p => p.category))
      ]
        .filter(category => category.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 2)
        .map(category => ({
          type: 'category',
          title: category,
          subtitle: `${products.filter(p => p.category === category).length} produits`
        }));

      setSuggestions([...productSuggestions, ...categorySuggestions]);
    } else {
      // Afficher les recherches récentes et produits tendance
      const recentSuggestions: SearchSuggestion[] = recentSearches
        .slice(0, 3)
        .map(search => ({
          type: 'recent',
          title: search,
          subtitle: 'Recherche récente'
        }));

      const trendingSuggestions: SearchSuggestion[] = trendingProducts
        .slice(0, 3)
        .map(product => ({
          type: 'product',
          title: product.name,
          subtitle: 'Produit tendance',
          id: product.id,
          price: product.price,
          image: product.image
        }));

      setSuggestions([...recentSuggestions, ...trendingSuggestions]);
    }
  }, [query, products, recentSearches, trendingProducts]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Sauvegarder dans les recherches récentes
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
      onSearch?.(searchQuery);
      setIsOpen(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'product' && suggestion.id) {
      navigate(`/${getSecureProductId(suggestion.id, 'product')}`);
    } else if (suggestion.type === 'category') {
      navigate(`/categorie/${suggestion.title}`);
    } else {
      setQuery(suggestion.title);
      handleSearch(suggestion.title);
    }
    setIsOpen(false);
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'recent': return <Clock className="h-4 w-4 text-gray-400" />;
      case 'category': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default: return <Star className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          className="pl-10 pr-10 py-3 text-base rounded-full border-2 border-gray-200 focus:border-red-500 transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="shadow-lg border border-gray-200">
              <div className="max-h-96 overflow-y-auto">
                {query.length === 0 && (
                  <div className="p-3 border-b border-gray-100">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {recentSearches.length > 0 ? 'Recherches récentes' : 'Produits tendance'}
                    </h3>
                  </div>
                )}
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={`${suggestion.type}-${suggestion.title}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 border-b border-gray-50 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      {suggestion.image && suggestion.type === 'product' ? (
                        <img
                          src={suggestion.image}
                          alt={suggestion.title}
                          className="w-10 h-10 object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center">
                          {getSuggestionIcon(suggestion.type)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.title}
                          </span>
                          {suggestion.type === 'product' && (
                            <Badge variant="outline" className="text-xs">
                              {suggestion.price?.toFixed(2)}€
                            </Badge>
                          )}
                        </div>
                        {suggestion.subtitle && (
                          <p className="text-xs text-gray-500 truncate">{suggestion.subtitle}</p>
                        )}
                      </div>
                      {suggestion.type === 'product' && (
                        <TrendingUp className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligentSearchBar;
