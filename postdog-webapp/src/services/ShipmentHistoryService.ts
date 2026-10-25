import { IOrder, ApiResponse, ShipmentHistoryResponse, ShipmentHistoryItem, ShipmentFilterParams } from '../types';
import { mapShipmentHistoryList, mapShipmentDetailApiToOrder } from '../utils/mappers/shipment.mapper';
import { HttpService } from './apiClient';



const ShipmentHistoryService = {
    getShipmentsHistory: async (params: ShipmentFilterParams = {}): Promise<ApiResponse<IOrder>> => {
        const { 
            page = 1, 
            limit = 10, 
            search = '', 
            carrier = 'Todas', 
            status = 'Todos', 
            insurance = 'Todos', 
            sort = 'Más reciente', 
            date = 'Todas' 
        } = params;

        const queryParams = new URLSearchParams();
        
        queryParams.append('limit', limit.toString());
        queryParams.append('offset', ((page - 1) * limit).toString());

        if (search && search.length >= 2) queryParams.append('search', search);
        
        if (carrier && carrier !== 'Todas') {
            const carrierMap: Record<string, string> = {
                'FedEx': 'fedex',
                'DHL': 'dhl',
                'Estafeta': 'estafeta',
                'J&T': 'jnt',
                'Todas': ''
            };
            const apiCarrier = carrierMap[carrier] || carrier;
            queryParams.append('carrier', apiCarrier);
        }

        if (status && status !== 'Todos') {
            const statusMap: Record<string, string> = {
                'Pendiente de envío': 'PENDING_SHIPMENT',
                'En camino': 'SHIPPED',
                'Entregado': 'DELIVERED',
                'Cancelado': 'CANCELED',
                'Pagado': 'PAID',
                'Pago fallido': 'PAYMENT_FAILED',
                'Incidencia': 'INCIDENT',
                'Pendiente': 'PENDING'
            };
            const apiStatus = statusMap[status] || status;
            queryParams.append('status', apiStatus);
        }

        if (insurance !== 'Todos') {
            queryParams.append('insurance', insurance === 'Con seguro' ? 'true' : 'false');
        }

        if (sort !== 'Más reciente') {
            queryParams.append('sort_by', sort === 'Más antiguo' ? 'OLDEST' : 'NEWEST');
        } else {
            queryParams.append('sort_by', 'NEWEST');
        }

        if (date !== 'Todas') {
            let dateFrom = new Date();
            let dateTo = new Date();

            if (date === 'Personalizado' && params.startDate && params.endDate) {
                dateFrom = new Date(params.startDate);
                dateTo = new Date(params.endDate);
            } else {
                const now = new Date();
                dateTo = now;
                switch (date) {
                    case 'Hoy': dateFrom.setHours(0, 0, 0, 0); break;
                    case 'Últimos 7 días': dateFrom.setDate(now.getDate() - 7); break;
                    case 'Últimos 30 días': dateFrom.setDate(now.getDate() - 30); break;
                    case 'Últimos 3 meses': dateFrom.setMonth(now.getMonth() - 3); break;
                }
            }
            
            queryParams.append('date_from', dateFrom.toISOString());
            queryParams.append('date_to', dateTo.toISOString());
        }

        try {
            const response = await HttpService.get<ShipmentHistoryResponse>(
                `shipments/history?${queryParams.toString()}`
            );
            
            const mappedData: IOrder[] = response.data.map(mapShipmentHistoryList);

            const total = response.total || 0;
            const totalPages = Math.ceil(total / limit);

            return {
                data: mappedData,
                meta: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error("Error fetching shipment history:", error);
            throw error;
        }
    },
    getShipmentDetail: async (uid: string): Promise<IOrder> => {
        try {
            const response = await HttpService.get<any>(`shipments/${uid}`);
            return mapShipmentDetailApiToOrder(response);
        } catch (error) {
            console.error(`Error fetching shipment detail for ${uid}:`, error);
            throw error;
        }
    },
    cancelShipment: async (shipmentUid: string, reason: string, details?: string): Promise<any> => {
        try {
            const payload: any = { reason };
            if (reason === 'OTHER' && details) {
                payload.details = details;
            }

            const response = await HttpService.post<any, any>(`shipments/${shipmentUid}/cancel`, payload);
            return response;
        } catch (error: any) {
            console.error(`Error canceling shipment ${shipmentUid}:`, error);
            const errorMessage = error.response?.data?.message || "Error al cancelar el envío.";
            throw new Error(errorMessage);
        }
    },
    downloadGuides: async (uids: string[], type: 'individual' | 'agrupado'): Promise<Blob> => {
        const payload = {
            shipmentUids: uids,
            format: type === 'individual' ? 'ZIP' : 'SINGLE_PDF'
        };

        try {
            const response = await HttpService.download('shipments/labels/bulk', payload);
            return response.data;
        } catch (error) {
            console.error("Error downloading shipment labels:", error);
            throw error;
        }
    },
    getShipmentLabel: async (uid: string): Promise<Blob> => {
        try {
            const response = await HttpService.getBlob(`shipments/${uid}/label`);
            return response;
        } catch (error) {
            console.error(`Error fetching label for shipment ${uid}:`, error);
            throw error;
        }
    },
    importManualShipments: async (data: any[]): Promise<{ success: boolean; message: string }> => {
        return {
            success: true,
            message: `${data.length} envíos importados correctamente.`
        };
    },

    importBulkShipments: async (file: File): Promise<{ success: boolean; message: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await HttpService.upload<any>('shipments/import', formData);
            return {
                success: true,
                message: response.message || "Archivo procesado Correctamente."
            };
        } catch (error: any) {
            console.error("Error bulk import:", error);
            const errorMessage = error.response?.data?.message || "Ocurrió un error al importar el archivo.";
            throw new Error(errorMessage);
        }
    },
    addInsurance: async (shipmentUid: string, declaredValue: number): Promise<ShipmentHistoryItem> => {
        try {
            const payload = {
                declaredValue: declaredValue
            };
            const response = await HttpService.post<ShipmentHistoryItem, { declaredValue: number }>(
                `shipments/${shipmentUid}/pawsafe`,
                payload
            );
            return response;
        } catch (error: any) {
            console.error(`Error adding insurance to shipment ${shipmentUid}:`, error);
            const errorMessage = error.response?.data?.message || "Error al agregar el seguro.";
            throw new Error(errorMessage);
        }
    },
};

export default ShipmentHistoryService;