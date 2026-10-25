import { useState, useCallback } from 'react';
import SATProductService from '../services/SATProductService';
import { SATProduct } from '../types';

export const useSATProducts = () => {
  const [options, setOptions] = useState<{ code: string; description: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const searchProducts = useCallback(async (keyword?: string) => {
    setLoading(true);
    try {
      const data = await SATProductService.getProducts(keyword);
      const mapped = data.map((item: SATProduct) => ({
        code: item.code,
        description: item.name
      }));
      setOptions(mapped);
    } catch (err) {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOptions = useCallback(() => {
    setOptions([]);
  }, []);

  return {
    options,
    loading,
    searchProducts,
    clearOptions
  };
};