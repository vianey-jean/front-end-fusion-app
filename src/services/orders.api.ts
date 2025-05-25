
import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrdersAPI = axios.create({
  baseURL: `${AUTH_BASE_URL}/api/orders`,
  timeout: 20000,
});

// Intercepteur pour les requêtes
OrdersAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interfaces
export interface ShippingAddress {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  pays: string;
  telephone: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  images?: string[];
  subtotal: number;
  codePromoApplied?: boolean;
  originalPrice?: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  codePromoUsed?: string | null;
  status: 'confirmée' | 'en préparation' | 'en livraison' | 'livrée';
  createdAt: string;
  updatedAt: string;
}

// Services pour les commandes
export const ordersAPI = {
  getAll: () => OrdersAPI.get<Order[]>('/'),
  getUserOrders: () => OrdersAPI.get<Order[]>('/user'),
  getById: (orderId: string) => OrdersAPI.get<Order>(`/${orderId}`),
  create: (orderData: any) => {
    const validatedData = {
      items: Array.isArray(orderData.items) 
        ? orderData.items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            ...(item.price !== undefined && { price: Number(item.price) }),
          })) 
        : [],
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      codePromo: orderData.codePromo
    };
    
    return OrdersAPI.post<Order>('/', validatedData);
  },
  updateStatus: (orderId: string, status: string) => 
    OrdersAPI.put(`/${orderId}/status`, { status }),
  cancelOrder: (orderId: string, itemsToCancel: string[]) => 
    OrdersAPI.post(`/${orderId}/cancel`, { itemsToCancel }),
};
