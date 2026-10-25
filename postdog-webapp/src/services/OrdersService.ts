import { ApiResponseItems, FilterValues, OrderPickups, OrderResponse } from '../types';
import { HttpService } from './apiClient';
import { mapApiOrders } from '../utils/mappers';


const OrderService = {
    getOrderShipments: async (
        filters: FilterValues,
        page: number,
        limit: number
    ): Promise<ApiResponseItems<OrderPickups>> => {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams();

        params.append('offset', String(offset));
        params.append('limit', String(limit));

        if (filters.searchTerm) {
            params.append('search', filters.searchTerm);
        }
        
        if (filters.startDate) {
            params.append('date_from', filters.startDate);
        }
        
        if (filters.endDate) {
            params.append('date_to', filters.endDate);
        }

        if (filters.stores && filters.stores.length > 0) {
            const stores = filters.stores.filter(i => i !== 'Todos');
            if (stores.length > 0) {
                params.append('ecommerce_source', stores.join(',').toUpperCase());
            }
        }

        const urlService = `/orders?${params.toString()}`;
        const response = await HttpService.get<{
            data: any[],
            meta: {
                total: number,
                limit: number,
                offset: number
            }
        }>(urlService);


        return {
            items: response.data.map(mapApiOrders),
            meta: {
                total: response.meta.total,
                limit: response.meta.limit,
                page: Math.floor(response.meta.offset / response.meta.limit) + 1,
                totalPages: Math.ceil(response.meta.total / response.meta.limit),
                hasNext: response.meta.offset + response.meta.limit < response.meta.total,
                hasPrev: response.meta.offset > 0
            }
        };
    },
    getOrderPickups: async (
        filters: FilterValues,
        page: number,
        limit: number
    ): Promise<ApiResponseItems<OrderPickups>> => {
        const params = new URLSearchParams();

        params.append('page', String(page));
        params.append('limit', String(limit));

        if (filters.startDate) {
            params.append('startDate', filters.startDate);
        }
        if (filters.endDate) {
            params.append('endDate', filters.endDate);
        }
        if (filters.statuses && filters.statuses.length > 0) {
            params.append('statuses', filters.statuses.join(','));
        }
        if (filters.stores && filters.stores.length > 0) {
            const stores = filters.stores.filter(s => s !== 'Todos');
            if (stores.length > 0) {
                params.append('stores', stores.join(','));
            }
        }
        if (filters.integrations && filters.integrations.length > 0) {
            const integrations = filters.integrations.filter(i => i !== 'Todos');
            if (integrations.length > 0) {
                params.append('integrations', integrations.join(','));
            }
        }
        if (filters.searchTerm) {
            params.append('q', filters.searchTerm);
        }

        const urlService = `/orders/pickups?${params.toString()}`;
        const response = await HttpService.get<ApiResponseItems<OrderPickups>>(urlService);
        return response;
    },

    CreateOrderShipment: async (dataOrder: any): Promise<OrderResponse> => {
        const response = await HttpService.post<OrderResponse, any>('/shipments', dataOrder);
        return response;
    },

    deleteOrder: async (orderUid: string): Promise<{ uid: string; status: string }> => {
        const response = await HttpService.delete<{ uid: string; status: string }>(`/orders/${orderUid}`);
        return response;
    }
};
export default OrderService;