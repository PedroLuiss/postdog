import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '../services/DashboardService';
import { DashboardMetrics } from '../types/dashboard.type';

export const useDashboardMetrics = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMetrics = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await DashboardService.getMetrics();
            setMetrics(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar métricas');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]);

    return { metrics, isLoading, error, refreshMetrics: fetchMetrics };
};
