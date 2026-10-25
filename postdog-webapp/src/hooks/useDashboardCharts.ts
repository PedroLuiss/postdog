import { useState, useEffect, useCallback } from 'react';
import { DashboardService } from '../services/DashboardService';
import { DashboardCharts } from '../types/dashboard.type';

export const useDashboardCharts = (year: number = 2026) => {
    const [charts, setCharts] = useState<DashboardCharts | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCharts = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await DashboardService.getCharts(year);
            setCharts(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar gráficos');
        } finally {
            setIsLoading(false);
        }
    }, [year]);

    useEffect(() => {
        fetchCharts();
    }, [fetchCharts]);

    return { charts, isLoading, error, refreshCharts: fetchCharts };
};
