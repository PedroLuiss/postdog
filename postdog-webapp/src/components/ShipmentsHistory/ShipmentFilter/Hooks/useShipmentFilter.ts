import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

export const useShipmentFilter = (filters: any, onFilterChange: any, onFilterClose: any, isFilterOpen: boolean) => {
    const [activeSelect, setActiveSelect] = useState<string | null>(null);
    const [openCalendar, setOpenCalendar] = useState<'startDate' | 'endDate' | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.carrier !== 'Todas') count++;
        if (filters.status !== 'Todos') count++;
        if (filters.insurance !== 'Todos') count++;
        if (filters.date !== 'Todas') count++;
        return count;
    }, [filters]);

    const handleSelectOption = useCallback((field: string, value: string) => {
        onFilterChange({ ...filters, [field]: value });
        setActiveSelect(null);
    }, [filters, onFilterChange]);

    const handleDateSelect = useCallback((field: 'startDate' | 'endDate', dateValue: string) => {
        onFilterChange({ ...filters, [field]: dateValue });
        setOpenCalendar(null);
    }, [filters, onFilterChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isFilterOpen && popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                onFilterClose();
                setActiveSelect(null);
                setOpenCalendar(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isFilterOpen, onFilterClose]);

    return {
        activeSelect,
        setActiveSelect,
        openCalendar,
        setOpenCalendar,
        popoverRef,
        activeFiltersCount,
        handleSelectOption,
        handleDateSelect
    };
};