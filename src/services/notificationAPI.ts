
export interface SaleNotification {
  id: string;
  customerName: string;
  name?: string;
  productId?: string;
  price?: number;
  location: string;
  timeAgo: string;
  timestamp: string;
}

export interface NotificationResponse {
  data: {
    notification: SaleNotification | null;
    orderStats: {
      today: number;
      week: number;
      month: number;
      year: number;
    };
  };
}

// Mock API for notifications
export const notificationAPI = {
  getLatest: async (lastCheckTime: string): Promise<NotificationResponse> => {
    // Simulate API call with mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockNotification: SaleNotification = {
          id: Date.now().toString(),
          customerName: 'Client ' + Math.floor(Math.random() * 1000),
          name: 'Produit Premium',
          productId: 'prod_' + Math.floor(Math.random() * 100),
          price: Math.floor(Math.random() * 200) + 50,
          location: 'Paris, France',
          timeAgo: 'il y a ' + Math.floor(Math.random() * 10) + ' minutes',
          timestamp: new Date().toISOString()
        };

        resolve({
          data: {
            notification: Math.random() > 0.7 ? mockNotification : null,
            orderStats: {
              today: Math.floor(Math.random() * 10) + 1,
              week: Math.floor(Math.random() * 50) + 10,
              month: Math.floor(Math.random() * 200) + 50,
              year: Math.floor(Math.random() * 1000) + 200
            }
          }
        });
      }, 1000);
    });
  }
};
