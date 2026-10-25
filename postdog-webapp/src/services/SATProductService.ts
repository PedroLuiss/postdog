import { SATProduct } from '../types';
import { HttpService } from './apiClient';


const SATProductService = {
  getProducts: async (keyword?: string): Promise<SATProduct[]> => {
    const params = new URLSearchParams();
    if (keyword && keyword.length >= 3) {
      params.append('keyword', keyword);
    }
    
    return await HttpService.get<SATProduct[]>(`/sat/products?${params.toString()}`);
  }
};

export default SATProductService;