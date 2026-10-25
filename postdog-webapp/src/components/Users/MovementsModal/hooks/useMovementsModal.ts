import { useState, useEffect } from 'react';
import { AdminUserService } from '../../../../services/AdminUserService';
import { UserSummary } from '../../../../types';

export const useMovementsModal = (uid: string | undefined, isOpen: boolean) => {
    const [summary, setSummary] = useState<UserSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && uid) {
            fetchSummary();
        } else {
            setSummary(null);
        }
    }, [isOpen, uid]);

    const fetchSummary = async () => {
        if (!uid) return;
        setIsLoading(true);
        setError(null);
        try {
            const data = await AdminUserService.getUserSummary(uid);
            setSummary(data);
        } catch (err) {
            console.error('Error fetching user summary:', err);
            setError('No se pudo cargar la información de movimientos');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        summary,
        isLoading,
        error,
        fetchSummary
    };
};
