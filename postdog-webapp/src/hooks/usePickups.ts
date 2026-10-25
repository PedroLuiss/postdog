import { useState, useEffect, useCallback, useRef } from 'react';
import OrderService from '../services/OrdersService';
import { FilterValues, OrderPickups } from '../types';

const INITIAL_FILTERS: FilterValues = {
    searchTerm: '',
    startDate: '',
    endDate: '',
    statuses: [],
    stores: [],
    integrations: []
};

const INITIAL_PAGE_SIZE = 5;

export const usePickups = (initialFilters: FilterValues = INITIAL_FILTERS) => {
    const [pickup, setPickup] = useState<OrderPickups[]>([]);

    const [pageSize] = useState<number>(INITIAL_PAGE_SIZE);

    // Infinite scroll state
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [totalItems, setTotalItems] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterValues>(initialFilters);

    // Prevent double fetching
    const loadingRef = useRef(false);

    const fetchShipments = useCallback(async (pageToFetch: number, reset: boolean = false) => {
        if (loadingRef.current) return;

        try {
            loadingRef.current = true;
            setIsLoading(true);
            if (reset) setError(null);

            const response = await OrderService.getOrderPickups(filters, pageToFetch, pageSize);

            setPickup(prev => reset ? response.items : [...prev, ...response.items]);
            setTotalItems(response.meta.total);
            setHasMore(response.meta.total > (pageToFetch * pageSize));

        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado');
            if (reset) setPickup([]);
        } finally {
            setIsLoading(false);
            loadingRef.current = false;
        }
    }, [filters, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
        fetchShipments(1, true);
    }, [filters, fetchShipments]);

    const refreshOrders = () => {
        setCurrentPage(1);
        fetchShipments(1, true);
    };

    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchShipments(nextPage, false);
        }
    };

    const changePageSize = (newPageSize: number) => {
        // Not used in infinite scroll typically strictly like pagination, but kept for compatibility
        // setPageSize(newPageSize); 
    };

    return {
        pickup,
        isLoading,
        error,
        filters,
        totalItems,
        pageSize,
        hasMore,
        setFilters,
        refreshOrders,
        loadMore,
        changePageSize
    };
};