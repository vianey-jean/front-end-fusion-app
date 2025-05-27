
export interface FlashSale {
  id: string;
  title: string;
  description?: string;
  discount: number; // Pourcentage de réduction
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  isActive: boolean;
  productIds: string[]; // IDs des produits inclus
  bannerImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlashSaleFormData {
  title: string;
  description?: string;
  discount: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  bannerImage?: File;
}

export interface FlashSaleProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  category: string;
  stock: number;
  isSold: boolean;
}
