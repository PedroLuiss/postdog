import { useState, useEffect, useCallback, useRef } from 'react';
import { IOrder } from '../types';
import ShipmentHistoryService from '../services/ShipmentHistoryService';

export const useShipmentsHistory = () => {
    const [shipments, setShipments] = useState<IOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const [filters, setFilters] = useState({
        carrier: 'Todas',
        status: 'Todos',
        insurance: 'Todos',
        sort: 'Más reciente',
        date: 'Todas',
        startDate: '',
        endDate: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const observerTarget = useRef<HTMLDivElement | null>(null);

    const fetchShipments = useCallback(async (page: number, append: boolean = false) => {
        if (page === 1) setIsLoading(true);
        else setIsFetchingMore(true);

        try {
            const response = await ShipmentHistoryService.getShipmentsHistory({
                page: page,
                limit: itemsPerPage,
                search: searchTerm,
                ...filters
            });

            if (append) {
                setShipments(prev => [...prev, ...response.data]);
            } else {
                setShipments(response.data);
            }

            setTotalItems(response.meta.total);
            setTotalPages(response.meta.totalPages);
        } catch (err) {
            setError("Error al cargar el historial");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, [itemsPerPage, searchTerm, filters]);


    const toggleSelectAll = () => {
        if (selectedIds.length === shipments.length && shipments.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(shipments.map(s => s.uid));
        }
    };

    const toggleSelectItem = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };


    useEffect(() => {
        if (filters.date === 'Personalizado' && (!filters.startDate || !filters.endDate)) {
            return;
        }

        setCurrentPage(1);
        fetchShipments(1, false);
    }, [searchTerm, filters, itemsPerPage, fetchShipments]);

    useEffect(() => {
        if (currentPage > 1) {
            fetchShipments(currentPage, true);
        }
    }, [currentPage, fetchShipments]);

    const loadMore = useCallback(() => {
        if (!isLoading && !isFetchingMore && currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    }, [isLoading, isFetchingMore, currentPage, totalPages]);

    useEffect(() => {
        const currentTarget = observerTarget.current;
        const hasMore = currentPage < totalPages;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [currentPage, totalPages, isFetchingMore, isLoading, loadMore]);




    return {
        shipments,
        totalItems,
        totalPages,
        currentPage,
        itemsPerPage,
        setCurrentPage,
        setItemsPerPage,
        isLoading,
        isFetchingMore,
        hasMore: currentPage < totalPages,
        loadMore,
        error,
        searchTerm,
        setSearchTerm,
        selectedIds,
        toggleSelectAll,
        toggleSelectItem,
        isFilterOpen,
        filters,
        setFilters,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        isImportOpen,
        setIsImportOpen,
        observerTarget,
        toggleFilter: () => setIsFilterOpen(!isFilterOpen),
        closeFilter: () => setIsFilterOpen(false),
        clearFilters: () => {
            setFilters({
                carrier: 'Todas',
                status: 'Todos',
                insurance: 'Todos',
                sort: 'Más reciente',
                date: 'Todas',
                startDate: '',
                endDate: ''
            });
        },
        clearAll: () => {
            setSearchTerm('');
            setFilters({
                carrier: 'Todas',
                status: 'Todos',
                insurance: 'Todos',
                sort: 'Más reciente',
                date: 'Todas',
                startDate: '',
                endDate: ''
            });
        },
        refresh: () => {
            setCurrentPage(1);
            fetchShipments(1, false);
        }
    };
};