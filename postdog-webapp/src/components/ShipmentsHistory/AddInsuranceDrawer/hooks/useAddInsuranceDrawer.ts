import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNotification } from '../../../../context/NotificationContext';
import ShipmentHistoryService from '../../../../services/ShipmentHistoryService';

export const useAddInsuranceDrawer = ({ shipmentData, isOpen, onClose, onSuccess }: any) => {
    const { showNotification } = useNotification();
    
    const [isActive, setIsActive] = useState(true);
    const [declaredValue, setDeclaredValue] = useState<string>('1000');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldError, setFieldError] = useState<string | undefined>(undefined);

    const isValueValid = useMemo(() => {
        const num = parseFloat(declaredValue);
        return !isNaN(num) && num > 0;
    }, [declaredValue]);

    const shippingPrice = useMemo(() => {
        if (!shipmentData) return 0;
        const grand = parseFloat(shipmentData.totals?.grand || "0");
        const currentInsurance = parseFloat(shipmentData.totals?.insurance || "0");
        return Math.max(0, grand - currentInsurance);
    }, [shipmentData]);
    
    const insuranceCost = useMemo(() => {
        const value = parseFloat(declaredValue) || 0;
        return value * 0.01; 
    }, [declaredValue]);

    const newTotal = useMemo(() => {
        return shippingPrice + (isActive ? insuranceCost : 0);
    }, [shippingPrice, insuranceCost, isActive]);

    useEffect(() => {
        if (!isOpen) {
            setIsActive(true);
            setDeclaredValue('1000');
            setIsSubmitting(false);
            setFieldError(undefined);
        }
    }, [isOpen]);

    const handleValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDeclaredValue(val);
        if (parseFloat(val) > 0) setFieldError(undefined);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!isActive) return;

        if (!isValueValid) {
            setFieldError("El valor debe ser mayor a 0");
            showNotification("Valor inválido", "Por favor ingresa un monto válido para el seguro.", 'warning');
            return;
        }

        setIsSubmitting(true);
        try {
            await ShipmentHistoryService.addInsurance(shipmentData.uid, parseFloat(declaredValue));
            showNotification("Seguro agregado", "El seguro PawSafe ha sido añadido correctamente.", 'success');
            if (onSuccess) onSuccess(); 
            onClose(); 
        } catch (error: any) {
            showNotification("Error", error.message || "No se pudo procesar.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    }, [isActive, isValueValid, declaredValue, shipmentData?.uid, showNotification, onSuccess, onClose]);

    return {
        isActive,
        handleToggleActive: (e: any) => setIsActive(e.target.checked),
        declaredValue,
        handleValueChange,
        shippingPrice,
        insuranceCost,
        newTotal,
        isSubmitting,
        handleSubmit,
        fieldError,
        isValueValid
    };
};