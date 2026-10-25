import { useState, useMemo } from 'react';
import { useDashboardCharts } from '../../../../hooks/useDashboardCharts';
import { BAR_COLORS } from '../constant';

export const useDashboardAnalytics = (initialYear: number = 2026) => {
    const [year, setYear] = useState(initialYear);
    const { charts, isLoading } = useDashboardCharts(year);

    const handlePrevYear = () => setYear(prev => prev - 1);
    const handleNextYear = () => setYear(prev => prev + 1);

    const mappedActivity = useMemo(() => {
        return charts?.annualActivity.map(item => ({
            month: item.month,
            envios: item.count,
            recargas: 0
        })) || [];
    }, [charts?.annualActivity]);

    const mappedCarriers = useMemo(() => {
        return charts?.topCarriers.map((item, index) => ({
            name: item.carrier,
            envios: item.count,
            color: BAR_COLORS[index % BAR_COLORS.length]
        })) || [];
    }, [charts?.topCarriers]);

    const mappedDestinations = useMemo(() => {
        return charts?.topDestinations.map((item, index) => ({
            city: item.state,
            envios: item.count,
            color: BAR_COLORS[index % BAR_COLORS.length]
        })) || [];
    }, [charts?.topDestinations]);

    const isNextYearDisabled = year >= new Date().getFullYear();

    return {
        year,
        isLoading,
        charts,
        mappedActivity,
        mappedCarriers,
        mappedDestinations,
        handlePrevYear,
        handleNextYear,
        isNextYearDisabled
    };
};