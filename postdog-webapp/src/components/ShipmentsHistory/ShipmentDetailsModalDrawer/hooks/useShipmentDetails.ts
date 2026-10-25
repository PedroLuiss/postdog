import { useState, useCallback, useEffect } from 'react';
import { IOrder } from '../../../../types';
import ShipmentHistoryService from '../../../../services/ShipmentHistoryService';

export const useShipmentDetails = (initialData: IOrder | null, isOpen: boolean) => {
    const [fullData, setFullData] = useState<IOrder | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openPackages, setOpenPackages] = useState<Record<number, boolean>>({});
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isOpen && initialData?.uid) {
            fetchFullDetails(initialData.uid);
        } else if (!isOpen) {
            setFullData(null);
            setError(null);
            setOpenPackages({});
        }
    }, [isOpen, initialData?.uid]);

    const fetchFullDetails = async (uid: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await ShipmentHistoryService.getShipmentDetail(uid);
            console.log(data);
            setFullData(data);
        } catch (err) {
            console.error('Error fetching full shipment details:', err);
            setError('No se pudo cargar la información detallada del envío.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePackage = useCallback((index: number) => {
        setOpenPackages(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    }, []);

    const handleCopy = useCallback((text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }, []);

    const displayData = fullData || initialData;

    return {
        shipmentData: displayData,
        isLoading,
        error,
        openPackages,
        isCopied,
        togglePackage,
        handleCopy
    };
};