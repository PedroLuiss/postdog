import { useState, useCallback } from 'react';
import { useNotification } from '../../../../../context/NotificationContext';
import { Alert } from '../../../../../types';

export const useGlobalAlertsRow = (
    alert: Alert, 
    onTogglePin?: (uid: string, isPinned: boolean) => Promise<void> | void
) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [isUpdatingPin, setIsUpdatingPin] = useState(false);
    const { showNotification } = useNotification();

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleTogglePin = useCallback(async (checked: boolean) => {
        if (!onTogglePin) return;
        
        setIsUpdatingPin(true);
        try {
            await onTogglePin(alert.uid, checked);
            showNotification(
                "Éxito", 
                checked ? "Alerta fijada correctamente." : "Alerta desfijada correctamente.", 
                "success", 
                3000
            );
        } catch (error) {
            showNotification(
                "Error", 
                "No se pudo actualizar el estado de la alerta.", 
                "error", 
                4000
            );
        } finally {
            setIsUpdatingPin(false);
        }
    }, [alert.uid, onTogglePin, showNotification]);

    const isOpen = Boolean(anchorEl);

    const priorityKey = alert.priority?.toLowerCase() === 'high' ? 'high' : alert.priority?.toLowerCase() === 'medium' ? 'medium' : 'low';
    
    const isSent = alert.sendAt ? new Date(alert.sendAt).getTime() <= new Date().getTime() : false;

    return {
        anchorEl,
        isUpdatingPin,
        isOpen,
        priorityKey,
        isSent,
        handleClick,
        handleClose,
        handleTogglePin
    };
};