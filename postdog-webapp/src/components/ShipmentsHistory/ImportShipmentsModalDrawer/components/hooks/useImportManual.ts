import { useState } from 'react';

export interface ManualShipment {
    id: string;
    carrier: string | number;
    tracking: string;
}

export const useImportManual = () => {
    const [shipments, setShipments] = useState<ManualShipment[]>([
        { id: Date.now().toString(), carrier: '', tracking: '' }
    ]);

    const addShipment = () => {
        setShipments([...shipments, { id: Date.now().toString(), carrier: '', tracking: '' }]);
    };

    const removeShipment = (id: string) => {
        if (shipments.length > 1) {
            setShipments(shipments.filter(s => s.id !== id));
        }
    };

    const updateShipment = (id: string, field: keyof ManualShipment, value: any) => {
        setShipments(shipments.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const isReadyToImport = shipments.every(s => s.carrier && s.tracking.trim().length > 0);

    return {
        shipments,
        addShipment,
        removeShipment,
        updateShipment,
        isReadyToImport
    };
};