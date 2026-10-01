import { apiClient } from './apiClient';
import { PRICE_MULTIPLIER } from '@constants/student';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export const fetchProducts = async (limit: number = 12): Promise<Product[]> => {
  const response = await apiClient.get<Product[]>(`/products?limit=${limit}`);
  return response.data;
};

export const fetchProductById = async (id: string | number): Promise<Product> => {
  const response = await apiClient.get<Product>(`/products/${id}`);
  return response.data;
};

export const calculateProductPrice = (rawPrice: number): number => {
  return Math.round(rawPrice * PRICE_MULTIPLIER);
};

export const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('vi-VN')} đ`;
};
