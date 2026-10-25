import { useCallback, useState } from 'react';
import { updateShipmentServices } from '../services/shipmentService';

interface ShipmentUpdateHook {
    isLoading: boolean;
    error: string | null;
    data: any | null;
    updateShipmentModal: (shipmentId: string, data: any) => Promise<boolean>;
    resetUpdateState: () => void;
}


export interface ResponseDataUpdateShipmentModal { success: boolean; message: string }

export const useUpdateShipment = (): ShipmentUpdateHook => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<ResponseDataUpdateShipmentModal | null>(null);

    const updateShipmentModal = async (shipmentId: string, shipmentData: any): Promise<boolean> => {
        setIsLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await updateShipmentServices(shipmentId, shipmentData);

            setData(response);
            setIsLoading(false);
            return true;

        } catch (err: any) {
            const errorMessage = err.message || 'Ocurrió un error inesperado.';
            setError(errorMessage);
            setIsLoading(false);
            console.error("Error en useUpdateShipment:", err);
            return false;
        }
    };

    const resetUpdateState = useCallback(() => {
        setError(null);
        setData(null);
    }, []);

    return { isLoading, error, data, updateShipmentModal, resetUpdateState };
};