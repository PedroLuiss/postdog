import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '../services/DashboardService';
import { RecentShipment } from '../types/dashboard.type';

export const useRecentShipments = () => {
    const [recentShipments, setRecentShipments] = useState<RecentShipment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecentShipments = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await DashboardService.getRecentShipments();
            setRecentShipments(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar envíos recientes');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRecentShipments();
    }, [fetchRecentShipments]);

    return { recentShipments, isLoading, error, refreshRecentShipments: fetchRecentShipments };
};
