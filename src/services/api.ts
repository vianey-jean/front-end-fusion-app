
import axios from 'axios';
import { getSecureRoute } from './secureIds';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${AUTH_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour inclure le token JWT dans chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Définition des interfaces pour les types de données
export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  genre?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileData {
  nom?: string;
  prenom?: string;
  telephone?: string;
  genre?: string;
  adresse?: string;
  ville?: string;
  codePostal?: string;
  pays?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  images: string[];
  image: string;
  promotion: number | null;
  promotionEnd: string | null;
  stock: number;
  isSold: boolean;
  dateAjout: string;
}

export interface PanierItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  items: PanierItem[];
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: {
    productId: string;
    name: string;
    price: number;
    originalPrice: number;
    quantity: number;
    image: string | null;
    subtotal: number;
  }[];
  totalAmount: number;
  originalAmount: number;
  discount: number;
  shippingAddress: {
    nom: string;
    prenom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    telephone: string;
  };
  paymentMethod: string;
  codePromoUsed: {
    code: string;
    productId: string;
    pourcentage: number;
    discountAmount: number;
  } | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  message: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
}

export interface ReviewFormData {
  productId: string;
  productRating: number;
  deliveryRating: number;
  comment: string;
  photos: File[];
}

export interface CodePromo {
  id: string;
  code: string;
  productId: string;
  pourcentage: number;
  quantite: number;
  dateExpiration: string;
}

export interface Message {
  id: string;
  userId?: string;
  userName?: string;
  message: string;
  timestamp: string;
  isAdmin?: boolean;
}

// Définition des objets API pour chaque entité
export const authAPI = {
  login: async (credentials: any) => {
    return await axiosInstance.post('/auth/login', credentials);
  },
  register: async (userData: any) => {
    return await axiosInstance.post('/auth/register', userData);
  },
  logout: async () => {
    return await axiosInstance.post('/auth/logout');
  },
  getUser: async () => {
    return await axiosInstance.get('/auth/user');
  },
  updateUser: async (userData: any) => {
    return await axiosInstance.put('/auth/user', userData);
  },
  updateProfile: async (profileData: UpdateProfileData) => {
    return await axiosInstance.put('/auth/profile', profileData);
  },
  updatePassword: async (passwords: any) => {
    return await axiosInstance.put('/auth/update-password', passwords);
  },
  verifyPassword: async (currentPassword: string) => {
    return await axiosInstance.post('/auth/verify-password', { currentPassword });
  },
  verifyToken: async () => {
    return await axiosInstance.get('/auth/verify');
  },
  forgotPassword: async (email: string) => {
    return await axiosInstance.post('/auth/forgot-password', { email });
  },
  resetPassword: async (resetCode: string, newPassword: string) => {
    return await axiosInstance.post('/auth/reset-password', { resetCode, newPassword });
  },
};

export const productsAPI = {
  getAll: async () => {
    return await axiosInstance.get('/products');
  },
  getById: async (id: string) => {
    return await axiosInstance.get(`/products/${id}`);
  },
  getByCategory: async (category: string) => {
    return await axiosInstance.get(`/products/category/${category}`);
  },
  getMostFavorited: async () => {
    return await axiosInstance.get('/products/most-favorited');
  },
  search: async (query: string) => {
    return await axiosInstance.get(`/products/search?q=${query}`);
  },
  create: async (productData: any) => {
    return await axiosInstance.post('/products', productData);
  },
  update: async (id: string, productData: any) => {
    return await axiosInstance.put(`/products/${id}`, productData);
  },
  delete: async (id: string) => {
    return await axiosInstance.delete(`/products/${id}`);
  },
};

export const panierAPI = {
  get: async () => {
    return await axiosInstance.get('/panier');
  },
  add: async (productId: string, quantity: number, price: number) => {
    return await axiosInstance.post('/panier/add', { productId, quantity, price });
  },
  addItem: async (productId: string, quantity: number, price: number) => {
    return await axiosInstance.post('/panier/add', { productId, quantity, price });
  },
  update: async (productId: string, quantity: number) => {
    return await axiosInstance.put(`/panier/${productId}`, { quantity });
  },
  updateItem: async (productId: string, quantity: number) => {
    return await axiosInstance.put(`/panier/${productId}`, { quantity });
  },
  remove: async (productId: string) => {
    return await axiosInstance.delete(`/panier/${productId}`);
  },
  removeItem: async (productId: string) => {
    return await axiosInstance.delete(`/panier/${productId}`);
  },
  clear: async () => {
    return await axiosInstance.delete('/panier/clear');
  },
};

export const favoritesAPI = {
  get: async () => {
    return await axiosInstance.get('/favorites');
  },
  add: async (productId: string) => {
    return await axiosInstance.post('/favorites/add', { productId });
  },
  addItem: async (productId: string) => {
    return await axiosInstance.post('/favorites/add', { productId });
  },
  remove: async (productId: string) => {
    return await axiosInstance.delete(`/favorites/${productId}`);
  },
  removeItem: async (productId: string) => {
    return await axiosInstance.delete(`/favorites/${productId}`);
  },
};

export const ordersAPI = {
  create: async (orderData: any) => {
    return await axiosInstance.post('/orders', orderData);
  },
  getUserOrders: async () => {
    return await axiosInstance.get('/orders/user');
  },
  getAll: async () => {
    return await axiosInstance.get('/orders');
  },
  getById: async (id: string) => {
    return await axiosInstance.get(`/orders/${id}`);
  },
  cancelOrder: async (id: string, itemsToCancel: string[]) => {
    return await axiosInstance.post(`/orders/${id}/cancel`, { itemsToCancel });
  },
  updateStatus: async (id: string, status: string) => {
    return await axiosInstance.put(`/orders/${id}/status`, { status });
  }
};

export const contactsAPI = {
  create: async (messageData: any) => {
    return await axiosInstance.post('/contacts', messageData);
  },
  getAll: async () => {
    return await axiosInstance.get('/contacts');
  },
  delete: async (id: string) => {
    return await axiosInstance.delete(`/contacts/${id}`);
  },
};

export const clientChatAPI = {
  getMessages: async () => {
    return await axiosInstance.get('/client-chat');
  },
  getServiceChat: async () => {
    return await axiosInstance.get('/client-chat/service');
  },
  sendMessage: async (messageData: any) => {
    return await axiosInstance.post('/client-chat', messageData);
  },
  sendServiceMessage: async (messageData: any) => {
    return await axiosInstance.post('/client-chat/service', messageData);
  },
  editMessage: async (messageId: string, newContent: string) => {
    return await axiosInstance.put(`/client-chat/${messageId}`, { message: newContent });
  },
  deleteMessage: async (messageId: string) => {
    return await axiosInstance.delete(`/client-chat/${messageId}`);
  },
};

export const adminChatAPI = {
  getMessages: async () => {
    return await axiosInstance.get('/admin-chat');
  },
  sendMessage: async (messageData: any) => {
    return await axiosInstance.post('/admin-chat', messageData);
  },
};

export const usersAPI = {
  getAll: async () => {
    return await axiosInstance.get('/users');
  },
  getById: async (id: string) => {
    return await axiosInstance.get(`/users/${id}`);
  },
  create: async (userData: any) => {
    return await axiosInstance.post('/users', userData);
  },
  update: async (id: string, userData: any) => {
    return await axiosInstance.put(`/users/${id}`, userData);
  },
  delete: async (id: string) => {
    return await axiosInstance.delete(`/users/${id}`);
  },
};

export const reviewsAPI = {
  getAll: async (productId: string) => {
    return await axiosInstance.get(`/reviews/product/${productId}`);
  },
  getProductReviews: async (productId: string) => {
    return await axiosInstance.get(`/reviews/product/${productId}`);
  },
  getReviewDetail: async (reviewId: string) => {
    return await axiosInstance.get(`/reviews/${reviewId}`);
  },
  create: async (reviewData: any) => {
    return await axiosInstance.post('/reviews', reviewData);
  },
  addReview: async (reviewData: ReviewFormData) => {
    const formData = new FormData();
    formData.append('productId', reviewData.productId);
    formData.append('productRating', reviewData.productRating.toString());
    formData.append('deliveryRating', reviewData.deliveryRating.toString());
    formData.append('comment', reviewData.comment);
    
    reviewData.photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    return await axiosInstance.post('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  update: async (id: string, reviewData: any) => {
    return await axiosInstance.put(`/reviews/${id}`, reviewData);
  },
  delete: async (id: string) => {
    return await axiosInstance.delete(`/reviews/${id}`);
  },
};

export const codePromoAPI = {
  getAll: async () => {
    return await axiosInstance.get('/code-promos');
  },
  getById: async (id: string) => {
    return await axiosInstance.get(`/code-promos/${id}`);
  },
  create: async (promoData: any) => {
    return await axiosInstance.post('/code-promos', promoData);
  },
  update: async (id: string, promoData: any) => {
    return await axiosInstance.put(`/code-promos/${id}`, promoData);
  },
  delete: async (id: string) => {
    return await axiosInstance.delete(`/code-promos/${id}`);
  },
  validateCode: async (code: string, productId?: string) => {
    return await axiosInstance.post('/code-promos/validate', { code, productId });
  },
};

// Alias pour compatibilité
export const codePromosAPI = codePromoAPI;

export const pubLayoutAPI = {
  get: async () => {
    return await axiosInstance.get('/pub-layout');
  },
  update: async (layoutData: any) => {
    return await axiosInstance.put('/pub-layout', layoutData);
  },
};

export interface Refund {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderItems: any[];
  orderTotal: number;
  reason: string;
  customReason: string;
  photos: string[];
  status: 'vérification' | 'en étude' | 'traité';
  decision?: 'accepté' | 'refusé';
  adminComments: {
    comment: string;
    adminName: string;
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export const refundsAPI = {
  // Créer une demande de remboursement
  create: async (refundData: FormData) => {
    return await axiosInstance.post('/refunds', refundData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Obtenir les demandes de l'utilisateur
  getUserRefunds: async () => {
    return await axiosInstance.get('/refunds/user');
  },

  // Obtenir une demande spécifique
  getById: async (id: string) => {
    return await axiosInstance.get(`/refunds/${id}`);
  },

  // Obtenir toutes les demandes (admin)
  getAll: async () => {
    return await axiosInstance.get('/refunds');
  },

  // Mettre à jour le statut (admin)
  updateStatus: async (id: string, status: string, comment?: string, decision?: string) => {
    return await axiosInstance.put(`/refunds/${id}/status`, {
      status,
      comment,
      decision
    });
  }
};

// Export par défaut pour compatibilité
const API = axiosInstance;
export default API;
