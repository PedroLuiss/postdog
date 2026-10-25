import { useState, useEffect, useCallback } from 'react';
import PickupService from '../services/PickupService';
import { FilterValues, ScheduledPickup, mockScheduledPickups } from '../types';
import { enrichPickupData } from '../utils/pickup.utils';

const INITIAL_FILTERS: FilterValues = {
    searchTerm: '',
    startDate: '',
    endDate: '',
    statuses: [],
    stores: [],
    integrations: []
};

const INITIAL_PAGE_SIZE = 5;

export const usePickup = (
    initialFilters: FilterValues = INITIAL_FILTERS,
    useMockData: boolean = false
) => {
    const [scheduledPickups, setScheduledPickups] = useState<ScheduledPickup[]>([]);
    const [paginationInfo, setPaginationInfo] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterValues>(initialFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const fetchPickups = useCallback(async (pageToFetch: number, append: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);

            let items: ScheduledPickup[] = [];
            let meta = { page: 1, totalPages: 1, total: 0 };

            if (useMockData) {
                await new Promise(resolve => setTimeout(resolve, 500));
                const startIndex = (pageToFetch - 1) * INITIAL_PAGE_SIZE;
                items = mockScheduledPickups.slice(startIndex, startIndex + INITIAL_PAGE_SIZE);
                meta = {
                    total: mockScheduledPickups.length,
                    page: pageToFetch,
                    totalPages: Math.ceil(mockScheduledPickups.length / INITIAL_PAGE_SIZE)
                };
            } else {
                const response = await PickupService.getPickups(filters, pageToFetch, INITIAL_PAGE_SIZE);
                items = response.items;
                meta = {
                    total: response.meta.total,
                    page: response.meta.page,
                    totalPages: response.meta.totalPages
                };
            }

            const enrichedItems = items.map(enrichPickupData);

            if (append) {
                setScheduledPickups(prev => {
                    const newItems = enrichedItems.filter(
                        item => !prev.some(p => p.id === item.id)
                    );
                    return [...prev, ...newItems];
                });
            } else {
                setScheduledPickups(enrichedItems);
            }

            setPaginationInfo({
                currentPage: meta.page,
                totalPages: meta.totalPages,
                totalItems: meta.total,
            });

        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado');
        } finally {
            setIsLoading(false);
        }
    }, [filters, useMockData]);

    const loadMore = useCallback(() => {
        if (!isLoading && paginationInfo.currentPage < paginationInfo.totalPages) {
            fetchPickups(paginationInfo.currentPage + 1, true);
        }
    }, [isLoading, paginationInfo.currentPage, paginationInfo.totalPages, fetchPickups]);

    const schedulePickup = useCallback((data: ScheduledPickup) => {
        setScheduledPickups(prev => {
            if (prev.some(p => p.id === data.id)) return prev;
            return [data, ...prev];
        });
    }, []);

    const handleSearch = useCallback(() => {
        fetchPickups(1, false);
    }, [fetchPickups]);

    const handleFiltersChange = useCallback((newFilters: FilterValues) => {
        setFilters(newFilters);
    }, []);

    const handleApplyFilters = useCallback((appliedFilters: FilterValues) => {
        setFilters(appliedFilters);
        setIsFilterOpen(false);
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters(INITIAL_FILTERS);
        setIsFilterOpen(false);
    }, []);

    const handleRefresh = useCallback(() => {
        fetchPickups(1, false);
    }, [fetchPickups]);

    useEffect(() => {
        fetchPickups(1, false);
    }, [fetchPickups]);

    return {
        scheduledPickups,
        isLoading,
        error,
        paginationInfo,
        filters,
        isFilterOpen,
        setIsFilterOpen,
        setFilters,
        onFiltersChange: handleFiltersChange,
        onApplyFilters: handleApplyFilters,
        onClearFilters: handleClearFilters,
        onRefresh: handleRefresh,
        onSearch: handleSearch,
        loadMore,
        schedulePickup,
        hasMore: paginationInfo.currentPage < paginationInfo.totalPages
    };
};
