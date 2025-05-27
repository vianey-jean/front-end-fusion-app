
import { API } from './apiConfig';
import { FlashSale, FlashSaleFormData, FlashSaleProduct } from '@/types/flashSale';

export const flashSalesAPI = {
  getAll: () => API.get<FlashSale[]>('/flash-sales'),
  getActive: () => API.get<FlashSale>('/flash-sales/active'),
  getById: (id: string) => API.get<FlashSale>(`/flash-sales/${id}`),
  getProducts: (id: string) => API.get<FlashSaleProduct[]>(`/flash-sales/${id}/products`),
  create: (data: FormData) => API.post<FlashSale>('/flash-sales', data),
  update: (id: string, data: FormData) => API.put<FlashSale>(`/flash-sales/${id}`, data),
  delete: (id: string) => API.delete(`/flash-sales/${id}`),
};
