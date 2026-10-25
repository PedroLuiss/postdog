import { useState, useCallback, useMemo } from 'react';
import { useCancelShipment } from '../../../../hooks/useCancelShipment';
import { useNotification } from '../../../../context/NotificationContext';
import { useWalletContext } from '../../../../context/WalletContext';

interface UseCancelShipmentLogicProps {
    shipmentData: any;
    onClose: () => void;
    onSuccess?: () => void;
}

export const useCancelShipmentModalDrawer = ({ shipmentData, onClose, onSuccess }: UseCancelShipmentLogicProps) => {
    const [selectedReason, setSelectedReason] = useState<string>('');
    const [otherReasonDetails, setOtherReasonDetails] = useState<string>('');
    const [isCopied, setIsCopied] = useState(false);
    const { refreshBalance } = useWalletContext();
    const { showNotification } = useNotification();
    
    const { executeCancel, isSubmitting } = useCancelShipment();

    const reasons = useMemo(() => [
        { id: 'INCORRECT_ADDRESS', label: 'Dirección incorrecta' },
        { id: 'EXPIRED_LABEL', label: 'Guía vencida' },
        { id: 'INCORRECT_CARRIER_SERVICE', label: 'Paquetería o servicio incorrecto' },
        { id: 'SHIPMENT_NOT_PICKED_UP', label: 'Envío no recolectado' },
        { id: 'OTHER', label: 'Otro motivo' },
    ], []);

    const handleCopy = useCallback((text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
    }, []);

    const onSubmit = useCallback(async () => {
        if (!selectedReason || !shipmentData?.uid) return;

        const reason = selectedReason;
        const details = selectedReason === 'OTHER' ? otherReasonDetails : '';

        try {
            await executeCancel(shipmentData.uid, reason, details);
            showNotification('Cancelación exitosa', 'El envío ha sido cancelado correctamente.', 'success');
            if (onSuccess) onSuccess();
            onClose();
            setSelectedReason('');
            setOtherReasonDetails('');
            refreshBalance(true); 
        } catch (err: any) {
            console.error("Error en la solicitud de cancelación:", err);
            showNotification('Error', err.message || 'No se pudo cancelar el envío.', 'error');
        }
    }, [selectedReason, otherReasonDetails, shipmentData?.uid, executeCancel, onClose, showNotification]);

    const isButtonDisabled = useMemo(() => {
        if (isSubmitting) return true;
        if (!selectedReason) return true;
        if (selectedReason === 'otro' && !otherReasonDetails.trim()) return true;
        return false;
    }, [isSubmitting, selectedReason, otherReasonDetails]);

    return {
        selectedReason,
        setSelectedReason,
        otherReasonDetails,
        setOtherReasonDetails,
        isCopied,
        isSubmitting,
        reasons,
        handleCopy,
        onSubmit,
        isButtonDisabled
    };
};