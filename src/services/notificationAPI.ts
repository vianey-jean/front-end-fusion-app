
import { API } from './apiConfig';

export interface SaleNotification {
  id: string;
  customerName: string;
  productId?: string;
  name: string;
  price?: number;
  quantity?: number;
  image?: string;
  subtotal?: number;
  orderId?: string;
  location: string;
  timestamp: string;
  date?: string;
  time?: string;
  timeAgo: string;
}

export interface OrderStats {
  today: number;
  week: number;
  month: number;
  year: number;
}

export interface NotificationResponse {
  notification: SaleNotification | null;
  orderStats: OrderStats;
}

export const notificationAPI = {
  getLatest: (since?: string) => {
    let url = '/sales-notifications/latest';
    if (since) {
      url += `?since=${since}`;
    }
    return API.get<NotificationResponse>(url);
  },
  
  recordSale: (data: {
    customerName: string;
    productName: string;
    location: string;
  }) => {
    return API.post<{ success: boolean; notification: SaleNotification }>('/sales-notifications/record', data);
  }
};
