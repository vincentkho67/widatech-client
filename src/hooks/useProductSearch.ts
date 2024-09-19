import { useState } from 'react';
import { Product } from '@/types/product';
import { ProductApiResponse } from '@/types/api-response/products/response';
import { toast } from '@/hooks/use-toast';

export const useProductSearch = () => {
  const [isLoading, setIsLoading] = useState(false);

  const searchProducts = async (query: string): Promise<Product[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/products?q=${query}`);
      const data: ProductApiResponse = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch products. Please try again.',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return { searchProducts, isLoading };
};