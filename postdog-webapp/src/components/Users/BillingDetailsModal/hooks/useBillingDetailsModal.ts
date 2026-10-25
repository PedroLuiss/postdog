import { useState, useEffect } from 'react';
import { UserFiscalData } from '../../../../types';
import { AdminUserService } from '../../../../services/AdminUserService';

export const useBillingDetailsModal = (uid: string | undefined, isOpen: boolean) => {
    const [fiscalData, setFiscalData] = useState<UserFiscalData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && uid) {
            fetchFiscalData();
        } else {
            setFiscalData(null);
        }
    }, [isOpen, uid]);

    const fetchFiscalData = async () => {
        if (!uid) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await AdminUserService.getUserFiscalData(uid);
            setFiscalData(data);
        } catch (err) {
            console.error('Error fetching fiscal data:', err);
            setError('No se pudo cargar la información fiscal');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fiscalData,
        isLoading,
        error,
        fetchFiscalData
    };
};
