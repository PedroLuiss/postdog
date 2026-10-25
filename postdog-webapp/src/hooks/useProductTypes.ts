
import { useState, useEffect, useCallback } from 'react';
import PackageProductService from '../services/PackageProductService'; 
import { ProductType } from '../types';

export const useProductTypes = () => {
    const [allTypes, setAllTypes] = useState<ProductType[]>([]);
    const [filteredTypes, setFilteredTypes] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const data = await PackageProductService.getProductTypes();
                setAllTypes(data);
            } catch (error) {
                console.error("Error fetching product types:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTypes();
    }, []);

    const filterTypes = useCallback((query: string) => {
        if (!query) {
            setFilteredTypes([]); 
            return;
        }

        const lowerCaseQuery = query.toLowerCase();

        const results = allTypes.filter(type =>
            type.name.toLowerCase().includes(lowerCaseQuery) ||
            type.description.includes(lowerCaseQuery)
        );

        setFilteredTypes(results);
    }, [allTypes]);

    return { isLoading, filteredTypes, filterTypes };
};