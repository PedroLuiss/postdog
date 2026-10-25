import { useState } from 'react';
import ShipmentHistoryService from '../services/ShipmentHistoryService';

export const useCancelShipment = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executeCancel = async (shipmentUid: string, reason: string, details?: string) => {
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await ShipmentHistoryService.cancelShipment(shipmentUid, reason, details);
            return response;
        } catch (err: any) {
            const msg = err.message || "Error al cancelar";
            setError(msg);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        executeCancel,
        isSubmitting,
        error
    };
};