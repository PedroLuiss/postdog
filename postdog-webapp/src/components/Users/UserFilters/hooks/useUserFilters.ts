import { useState, useMemo } from 'react';
import { Filters } from '../types';


export const useUserFilters = (
    searchTerm: string, 
    filters: Filters, 
    onFilterChange: (key: string, value: any) => void
) => {
    const [openCalendar, setOpenCalendar] = useState<string | null>(null);

    const hasActiveFilters = useMemo(() => {
        return (
            searchTerm.trim() !== '' || 
            filters.verification !== 'all' ||
            filters.plan !== 'all' ||
            filters.role !== 'all' ||
            filters.status !== 'all' ||
            filters.dateType !== 'all' ||
            filters.startDate !== null ||
            filters.endDate !== null
        );
    }, [searchTerm, filters]);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${parseInt(day)}/${parseInt(month)}/${year}`;
    };

    const handleDateSelect = (key: string, date: string) => {
        onFilterChange(key, date);
        setOpenCalendar(null);
    };

    const toggleCalendar = (key: string) => {
        setOpenCalendar(prev => prev === key ? null : key);
    };

    return {
        openCalendar,
        hasActiveFilters,
        formatDate,
        handleDateSelect,
        toggleCalendar
    };
};