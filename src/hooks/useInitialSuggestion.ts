import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

export const useInitialSuggestions = () => {
  const [initialSuggestions, setInitialSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    const fetchInitialSuggestions = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products');
        const data = await response.json();
        setInitialSuggestions(data.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching initial suggestions:', error);
      }
    };

    fetchInitialSuggestions();
  }, []);

  return { initialSuggestions };
};