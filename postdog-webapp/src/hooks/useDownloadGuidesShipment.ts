import { useState, useCallback } from 'react';
import ShipmentHistoryService from '../services/ShipmentHistoryService';

interface UseDownloadGuidesShipmentProps {
    selectedIds: string[];
    onClose: () => void;
}

export const useDownloadGuidesShipment = ({ selectedIds, onClose }: UseDownloadGuidesShipmentProps) => {
    const [downloadType, setDownloadType] = useState<'individual' | 'agrupado' | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleConfirmDownload = useCallback(async () => {
        if (selectedIds.length === 0 || !downloadType) return;

        setIsDownloading(true);
        try {
            const blob = await ShipmentHistoryService.downloadGuides(selectedIds, downloadType);

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            const filename = downloadType === 'individual'
                ? `guias_postdog_${new Date().getTime()}.zip`
                : `guias_postdog_${new Date().getTime()}.pdf`;

            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

            onClose();
        } catch (error) {
            console.error("Error al descargar guías:", error);
            alert("Ocurrió un error al procesar la descarga.");
        } finally {
            setIsDownloading(false);
        }
    }, [selectedIds, downloadType, onClose]);

    const changeDownloadType = useCallback((type: 'individual' | 'agrupado') => {
        setDownloadType(type);
    }, []);

    return {
        downloadType,
        isDownloading,
        handleConfirmDownload,
        changeDownloadType
    };
};