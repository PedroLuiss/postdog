import {  ProductType } from '../types';
import { HttpService } from './apiClient';


const PackageProductService = {
    getProductTypes: async (): Promise<ProductType[]> => {
         const response = await HttpService.get<ProductType[]>('/package-types');
         return response
    }
};

export default PackageProductService;

