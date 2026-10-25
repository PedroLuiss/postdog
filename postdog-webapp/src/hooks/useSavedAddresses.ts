import { useState, useEffect, useCallback } from 'react';
import AddressServices from '../services/AddressService';
import { DataSaveAddress, AddressTypeFilter } from '../types';

let addressCache: Record<string, DataSaveAddress[]> = {};

export const clearAddressCache = () => {
    addressCache = {};
};

export const useSavedAddresses = (type?: AddressTypeFilter) => {
    const [addresses, setAddresses] = useState<DataSaveAddress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAddresses = useCallback(async (forceRefresh = false) => {
        const cacheKey = type || 'all';

        if (!forceRefresh && addressCache[cacheKey]) {
            setAddresses(addressCache[cacheKey]);
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }

        setError(null);
        try {
            const data = await AddressServices.getSavedAddressesServices(type);
            addressCache[cacheKey] = data;
            setAddresses(data);
        } catch (err) {
            console.error('Error al cargar direcciones:', err);
            if (!addressCache[cacheKey]) {
                setError('No se pudieron cargar las direcciones.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [type]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const refetch = () => fetchAddresses(true);

    return { addresses, isLoading, error, refetch };
};
