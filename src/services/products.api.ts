
import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductsAPI = axios.create({
  baseURL: `${AUTH_BASE_URL}/api/products`,
  timeout: 15000,
});

// Intercepteur pour les requêtes
ProductsAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interface Produit
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  isSold: boolean;
  promotion?: number | null;
  promotionEnd?: string | null;
  stock?: number;
  dateAjout?: string;
}

// Services pour les produits
export const productsAPI = {
  getAll: () => ProductsAPI.get<Product[]>('/'),
  getById: (id: string) => ProductsAPI.get<Product>(`/${id}`),
  getByCategory: (category: string) => ProductsAPI.get<Product[]>(`/category/${category}`),
  getMostFavorited: () => ProductsAPI.get<Product[]>('/stats/most-favorited'),
  getNewArrivals: () => ProductsAPI.get<Product[]>('/stats/new-arrivals'),
  create: (product: FormData) => ProductsAPI.post<Product>('/', product),
  update: (id: string, product: FormData) => ProductsAPI.put<Product>(`/${id}`, product),
  delete: (id: string) => ProductsAPI.delete(`/${id}`),
  applyPromotion: (id: string, promotion: number, duration: number) => 
    ProductsAPI.post(`/${id}/promotion`, { promotion, duration }),
  search: (query: string) => ProductsAPI.get<Product[]>(`/search?q=${encodeURIComponent(query)}`),
};
