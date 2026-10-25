import { useState, useCallback } from 'react';
import ShipmentHistoryService from '../services/ShipmentHistoryService';
import { ManualShipment } from '../components/ShipmentsHistory/ImportShipmentsModalDrawer/components/hooks/useImportManual';
import { useNotification } from '../context/NotificationContext';

export const useImportShipments = (onClose: () => void) => {
    const [isImporting, setIsImporting] = useState(false);
    const [isImportingBulk, setIsImportingBulk] = useState(false);
    const { showNotification } = useNotification();

    const handleManualImport = useCallback(async (data: ManualShipment[]) => {
        setIsImporting(true);
        try {
            const response = await ShipmentHistoryService.importManualShipments(data);
            showNotification('Importación exitosa', response.message, 'success');
            onClose();
        } catch (error: any) {
            console.error("Error manual import:", error);
            showNotification('Error', error.message || 'Error al importar envíos', 'error');
        } finally {
            setIsImporting(false);
        }
    }, [onClose, showNotification]);

    const handleBulkImport = useCallback(async (file: File) => {
        setIsImportingBulk(true);
        try {
            const response = await ShipmentHistoryService.importBulkShipments(file);
            showNotification('Importación exitosa', response.message, 'success');
            onClose();
        } catch (error: any) {
            console.error("Error bulk import:", error);
            showNotification('Error', error.message || 'Error al importar el archivo', 'error');
        } finally {
            setIsImportingBulk(false);
        }
    }, [onClose, showNotification]);

    return {
        isImporting,
        handleManualImport,
        handleBulkImport,
        isImportingBulk
    };
};