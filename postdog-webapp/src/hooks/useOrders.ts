import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/OrdersService';
import { FilterValues, DataOrder, MOCK_ORDER_DATA } from '../types';
import { useShippingQuoteDrawer } from '../context';
import { useNotification } from '../context/NotificationContext';
import * as filterUtils from '../utils/filterUtils';
import { useCreateShipmentContext } from '../context/CreateShipmentContext';

// CONTROL DE DATOS: 
// true = Usa MOCK_ORDER_DATA de types
// false = Usa la API real (OrderService)
const USE_MOCK_DATA = false;

const INITIAL_FILTERS: FilterValues = {
    searchTerm: '',
    startDate: '',
    endDate: '',
    statuses: [],
    stores: ['Todos'],
    integrations: [],
    dateRange: ['Todas']
};

const INITIAL_PAGE_SIZE = 10;

export const useOrders = (initialFilters: FilterValues = INITIAL_FILTERS) => {
    const { showNotification } = useNotification();
    const { openCreateShipmentFromOrder } = useCreateShipmentContext();
    const navigate = useNavigate();
    const { openDrawerEditOrde } = useShippingQuoteDrawer();
    const [shipments, setShipments] = useState<DataOrder[]>([]);
    const [mockDataCache, setMockDataCache] = useState<DataOrder[]>([...MOCK_ORDER_DATA]);
    const [pageSize] = useState<number>(INITIAL_PAGE_SIZE);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<FilterValues>(initialFilters);
    const [isSynced, setIsSynced] = useState<boolean>(false);
    const loadingRef = useRef(false);
    const lastRequestId = useRef<number>(0);

    const fetchShipments = useCallback(async (pageToFetch: number, reset: boolean = false) => {
        if (loadingRef.current && !reset) return;

        const currentRequestId = Date.now();
        lastRequestId.current = currentRequestId;
        loadingRef.current = true;

        try {
            setIsLoading(true);
            if (reset) setError(null);

            if (USE_MOCK_DATA) {
                console.log(`[useOrders] Mock Fetch Start - ID: ${currentRequestId} | Search: "${filters.searchTerm}"`);
                await new Promise(resolve => setTimeout(resolve, 500));

                if (lastRequestId.current !== currentRequestId) {
                    console.log(`[useOrders] Request Aborted (Stale) - ID: ${currentRequestId}`);
                    return;
                }

                let filtered = [...mockDataCache];
                console.log(`[useOrders] Initial Cache Size: ${filtered.length}`);

                if (filters.searchTerm) {
                    const search = filters.searchTerm.toLowerCase();
                    filtered = filtered.filter(order =>
                        order.orderNumber.toString().includes(search) ||
                        order.destinationAddress?.fullName.toLowerCase().includes(search) ||
                        order.originAddress.fullName.toLowerCase().includes(search) ||
                        order.store?.toLowerCase().includes(search)
                    );
                }

                console.log(`[useOrders] After Search Filter: ${filtered.length}`);

                if (filters.stores && filters.stores.length > 0 && !filters.stores.includes('Todos')) {
                    filtered = filtered.filter(order => order.store && filters.stores.includes(order.store));
                }
                if (filters.startDate && filters.endDate) {
                    const start = new Date(filters.startDate);
                    const end = new Date(filters.endDate);
                    end.setHours(23, 59, 59, 999);

                    filtered = filtered.filter(order => {
                        const orderDate = new Date(order.createdAt);
                        return orderDate >= start && orderDate <= end;
                    });
                }

                console.log(`[useOrders] Final Filtered Count: ${filtered.length}`);

                const startIdx = (pageToFetch - 1) * pageSize;
                const endIdx = startIdx + pageSize;
                const newItems = filtered.slice(startIdx, endIdx);
                const total = filtered.length;

                setShipments(prev => reset ? newItems : [...prev, ...newItems]);
                setTotalItems(total);
                setHasMore(endIdx < total);

                return;
            }

            const response = await OrderService.getOrderShipments(filters, pageToFetch, pageSize);

            if (lastRequestId.current !== currentRequestId) return;

            setShipments(prev => reset ? response.items : [...prev, ...response.items]);
            setTotalItems(response.meta.total);
            setHasMore(response.meta.total > (pageToFetch * pageSize));

            if (response.meta.total > 0 && !isSynced) {
                setIsSynced(true);
            }


        } catch (err: any) {
            if (lastRequestId.current !== currentRequestId) return;

            setError(err.message || 'Ocurrió un error inesperado');
            if (reset) setShipments([]);
        } finally {
            if (lastRequestId.current === currentRequestId) {
                setIsLoading(false);
                loadingRef.current = false;
            }
        }
    }, [filters, pageSize, mockDataCache]);

    useEffect(() => {
        if (!USE_MOCK_DATA || isSynced) {
            setCurrentPage(1);
            fetchShipments(1, true);
        } else {
            setShipments([]);
            setTotalItems(0);
        }
    }, [filters, fetchShipments, isSynced]);

    const loadMore = () => {
        if (!isLoading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchShipments(nextPage, false);
        }
    };

    const refreshOrders = () => {
        setCurrentPage(1);
        fetchShipments(1, true);
    };

    const handleDateRangeChange = filterUtils.handleDateRangeChange;
    const handleFilterToggle = filterUtils.handleFilterToggle;
    const handleStoreChange = (selection: string[], currentFilters: FilterValues, onChange: (f: FilterValues) => void) => {
        onChange({ ...currentFilters, stores: selection });
    };
    const handleIntegrationChange = (selection: string[], currentFilters: FilterValues, onChange: (f: FilterValues) => void) => {
        onChange({ ...currentFilters, integrations: selection });
    };

    const deleteOrder = async (orderUid: string) => {
        try {
            setIsLoading(true);
            setError(null);

            if (USE_MOCK_DATA) {
                await new Promise(resolve => setTimeout(resolve, 800));
                setMockDataCache(prev => prev.filter(order => order.uid !== orderUid));
                setShipments(prev => prev.filter(order => order.uid !== orderUid));
                setTotalItems(prev => prev - 1);
            } else {
                await OrderService.deleteOrder(orderUid);
                showNotification('Orden eliminada', 'La orden ha sido eliminada correctamente', 'success', 3000);
                refreshOrders();
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Error al eliminar la orden';
            setError(errorMsg);
            showNotification('Error', errorMsg, 'error', 4000);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenDrawerEditOrder = (_order: DataOrder) => {
        openDrawerEditOrde();
    };

    const handleConnectStore = () => {
        console.log('Action: Conectar tienda');
    };

    const handleSyncOrders = () => {
        setIsSynced(true);
    };

    const handleCreateManualOrder = () => {
        navigate('/shipping/quote');
    };

    const getStatusTagModifier = (status: DataOrder['status']) => {
        switch (status) {
            case 'GENERATED': return 'table-list-orders__status-tag--generated';
            case 'PENDING': return 'table-list-orders__status-tag--pending';
            default: return '';
        }
    };

    const getStatusText = (status: DataOrder['status']) => {
        switch (status) {
            case 'GENERATED': return 'Generado';
            case 'PENDING': return 'Pendiente';
            default: return '';
        }
    };

    const handleShipOrder = (order: any) => {
        openCreateShipmentFromOrder(order);
    };

    return {
        shipments,
        filters,
        isSynced,
        totalItems,
        isLoading,
        error,
        hasMore,
        setFilters,
        refreshOrders,
        loadMore,
        handleStoreChange,
        handleIntegrationChange,
        handleFilterToggle,
        handleDateRangeChange,
        deleteOrder,
        handleOpenDrawerEditOrder,
        handleConnectStore,
        handleSyncOrders,
        handleCreateManualOrder,
        getStatusTagModifier,
        getStatusText,
        handleShipOrder
    };
};