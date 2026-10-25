export type ShipmentStatusType = 'blue' | 'red' | 'yellow' | 'green';

export interface ShipmentStatusInfo {
    label: string;
    dot: string;
    type: ShipmentStatusType;
}

export const getShipmentStatusInfo = (status: string): ShipmentStatusInfo => {
    const s = status?.toUpperCase();
    switch (s) {
        case 'PENDING_SHIPMENT':
        case 'GENERATED':
            return { label: 'Pendiente de envío', dot: '🔵', type: 'blue' };
        case 'SHIPPED':
            return { label: 'En camino', dot: '🔵', type: 'blue' };
        case 'DELIVERED':
            return { label: 'Entregado', dot: '🟢', type: 'green' };
        case 'CANCELLED':
        case 'CANCELED':
            return { label: 'Cancelado', dot: '🔴', type: 'red' };
        case 'PAID':
            return { label: 'Pagado', dot: '🟢', type: 'green' };
        case 'PAYMENT_FAILED':
            return { label: 'Pago fallido', dot: '🔴', type: 'red' };
        case 'ISSUE':
        case 'INCIDENT':
            return { label: 'Incidencia', dot: '🟡', type: 'yellow' };
        case 'PENDING':
            return { label: 'Pendiente', dot: '🟡', type: 'yellow' };
        default:
            return { label: status || 'N/A', dot: '🔵', type: 'blue' };
    }
};
