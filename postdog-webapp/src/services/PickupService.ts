import { HttpService } from './apiClient';
import {
    ApiResponseItems,
    FilterValues,
    ScheduledPickup,
    Option,
    GetPickupsApiResponse,
    PickupApiItem,
    CreatePickupRequest
} from '../types';

export interface ShipmentOption extends Option {
    address: string;
}

const PickupService = {
    getPickups: async (
        filters: FilterValues,
        page: number,
        limit: number
    ): Promise<ApiResponseItems<ScheduledPickup>> => {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams();
        params.append('offset', String(offset));
        params.append('limit', String(limit));

        if (filters.searchTerm) params.append('q', filters.searchTerm);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);

        const response = await HttpService.get<GetPickupsApiResponse>(`/pickups?${params.toString()}`);

        return {
            items: response.data.map(item => ({
                id: item.uid,
                pickupNumber: item.uid.split('-')[0].toUpperCase(),
                carrier: item.carrierName || item.carrierCode,
                carrierLogoUrl: item.logoUrl || '',
                pickupAddress: `${item.pickupAddress.addressLine}, ${item.pickupAddress.colony}, ${item.pickupAddress.postalCode}, ${item.pickupAddress.city}, ${item.pickupAddress.state}`,
                pickupDate: item.pickupDate,
                status: 'PROGRAMMED'
            })),
            meta: {
                total: response.meta.total,
                page: Math.floor(response.meta.offset / response.meta.limit) + 1,
                limit: response.meta.limit,
                totalPages: Math.ceil(response.meta.total / response.meta.limit),
                hasNext: response.meta.hasMore,
                hasPrev: response.meta.offset > 0
            }
        };
    },

    getCarriers: async (): Promise<Option[]> => {
        const response = await HttpService.get<{ carrierCode: string, carrierName: string }[]>('/pickups/eligible-carriers');
        return response.map(carrier => ({
            value: carrier.carrierCode,
            label: carrier.carrierName
        }));
    },

    getPendingShipments: async (carrier: string): Promise<ShipmentOption[]> => {
        const response = await HttpService.get<any[]>(`/pickups/eligible-shipments?carrier_code=${carrier}`);
        return response.map(shipment => ({
            value: shipment.uid,
            label: `${shipment.trackingProvisional || shipment.shipmentNumber} - ${shipment.originAddress.city}`,
            address: `${shipment.originAddress.addressLine}, ${shipment.originAddress.colony}, ${shipment.originAddress.postalCode}, ${shipment.originAddress.city}, ${shipment.originAddress.state}`
        }));
    },

    createPickup: async (data: CreatePickupRequest): Promise<ScheduledPickup> => {
        const response = await HttpService.post<PickupApiItem, CreatePickupRequest>('/pickups', data);

        return {
            id: response.uid,
            pickupNumber: response.uid.split('-')[0].toUpperCase(),
            carrier: response.carrierName || response.carrierCode,
            pickupAddress: `${response.pickupAddress.addressLine}, ${response.pickupAddress.colony}, ${response.pickupAddress.postalCode}, ${response.pickupAddress.city}, ${response.pickupAddress.state}`,
            pickupDate: response.pickupDate,
            status: 'PROGRAMMED'
        };
    }
};

export default PickupService;
