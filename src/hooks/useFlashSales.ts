
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FlashSale, FlashSaleProduct } from '@/types/flashSale';
import { flashSalesAPI } from '@/services/flashSalesAPI';

export const useActiveFlashSale = () => {
  return useQuery({
    queryKey: ['flash-sale', 'active'],
    queryFn: async () => {
      try {
        const response = await flashSalesAPI.getActive();
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 1 * 60 * 1000, // Refetch every minute
  });
};

export const useFlashSaleProducts = (flashSaleId: string | undefined) => {
  return useQuery({
    queryKey: ['flash-sale', flashSaleId, 'products'],
    queryFn: async () => {
      if (!flashSaleId) return [];
      const response = await flashSalesAPI.getProducts(flashSaleId);
      return response.data;
    },
    enabled: !!flashSaleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFlashSales = () => {
  return useQuery({
    queryKey: ['flash-sales'],
    queryFn: async () => {
      const response = await flashSalesAPI.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
