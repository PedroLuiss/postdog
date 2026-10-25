
import { useState, useEffect, useCallback } from 'react';
import PackageService, { PackageTypeOption } from '../services/PackageService'; 

export const usePackageTypes = () => {
    const [packageTypes, setPackageTypes] = useState<PackageTypeOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPackageTypes = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await PackageService.getPackageTypes();
            setPackageTypes(data);
        } catch (err) {
            console.error('Error al cargar los tipos de embalaje:', err);
            setError('No se pudieron cargar los tipos de embalaje.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPackageTypes();
    }, [fetchPackageTypes]);

    return { packageTypes, isLoading, error };
};