
import { useState, useRef, useEffect } from 'react';
import { useCreateShipmentContext } from '../../../../../context/CreateShipmentContext';
import { useNotification } from '../../../../../context/NotificationContext';
import { getShipmentStatusInfo } from '../../../../../utils/shipmentStatus.utils';
import ShipmentHistoryService from '../../../../../services/ShipmentHistoryService';

export const useShipmentItem = (data: any, styles: any) => {
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDownloadingLabel, setIsDownloadingLabel] = useState(false);
    const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);

    const { showNotification } = useNotification();
    const { openCreateReturn, openDuplicateShipment } = useCreateShipmentContext();
    
    const menuRefDesktop = useRef<HTMLDivElement>(null);
    const menuRefMobile = useRef<HTMLDivElement>(null);

    const isCancelled = data.status?.toUpperCase() === 'CANCELLED' || data.status?.toUpperCase() === 'CANCELED';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInsideDesktop = menuRefDesktop.current?.contains(event.target as Node);
            const isClickInsideMobile = menuRefMobile.current?.contains(event.target as Node);
            
            if (!isClickInsideDesktop && !isClickInsideMobile) {
                setIsActionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const [isCreatingReturn, setIsCreatingReturn] = useState(false);

    const handleCreateReturn = async () => {
        if (!data.uid) return;
        
        setIsCreatingReturn(true);
        try {
            const detailData = await ShipmentHistoryService.getShipmentDetail(data.uid);
            openCreateReturn(detailData);
            setIsActionsOpen(false);
        } catch (error) {
            console.error("Error fetching detail for return:", error);
            showNotification('Error', 'No se pudieron obtener los datos para crear el retorno', 'error', 3000);
        } finally {
            setIsCreatingReturn(false);
        }
    };

    const [isDuplicating, setIsDuplicating] = useState(false);

    const handleDuplicate = async () => {
        if (!data.uid) return;
        
        setIsDuplicating(true);
        try {
            const detailData = await ShipmentHistoryService.getShipmentDetail(data.uid);
            console.log('detailData', detailData);
            openDuplicateShipment(detailData);
            setIsActionsOpen(false);
        } catch (error) {
            console.error("Error fetching detail for duplication:", error);
            showNotification('Error', 'No se pudieron obtener los datos para duplicar el envío', 'error', 3000);
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleCopyTracking = () => {
        if (!data.trackingProvisional) return;
        navigator.clipboard.writeText(data.trackingProvisional);
        showNotification('Copiado', 'Número de rastreo copiado al portapapeles', 'success', 2000);
    };

    const handleDownloadLabel = async () => {
        if (!data.uid) return;
        
        setIsDownloadingLabel(true);
        try {
            const blob = await ShipmentHistoryService.getShipmentLabel(data.uid);
            
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `guia_${data.trackingProvisional || data.uid}.pdf`);
            document.body.appendChild(link);
            link.click();
            
            link.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (error) {
            console.error("Error al descargar guía:", error);
            showNotification('Error', 'No se pudo descargar la guía', 'error', 3000);
        } finally {
            setIsDownloadingLabel(false);
        }
    };

    const rawStatusInfo = getShipmentStatusInfo(data.status);
    const statusInfo = {
        ...rawStatusInfo,
        className: styles[`shipment-card__badge-${rawStatusInfo.type}`]
    };

    return {
        isActionsOpen,
        isCancelModalOpen,
        isDetailsModalOpen,
        isDownloadingLabel,
        isDuplicating,
        isCreatingReturn,
        isCancelled,
        statusInfo,
        setIsActionsOpen,
        setIsCancelModalOpen,
        setIsDetailsModalOpen,
        handleCreateReturn,
        handleDuplicate,
        handleCopyTracking,
        handleDownloadLabel,
        menuRefDesktop,
        menuRefMobile,
        isInsuranceModalOpen,
        setIsInsuranceModalOpen
    };
};
