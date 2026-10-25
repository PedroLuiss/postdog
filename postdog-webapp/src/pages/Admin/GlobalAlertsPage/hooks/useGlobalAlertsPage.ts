import { useState, useCallback } from 'react';
import { Alert, GlobalAlertCreateRequest } from '../../../../types';
import { useGlobalAlerts } from '../../../../hooks/useGlobalAlerts';

export const useGlobalAlertsPage = () => {
    const { 
        alerts, 
        loading, 
        isFetchingMore, 
        hasMore,
        observerTarget, 
        createAlert, 
        updateAlert, 
        deleteAlert, 
        togglePin 
    } = useGlobalAlerts();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [alertToDelete, setAlertToDelete] = useState<string | null>(null);
    const [alertToReschedule, setAlertToReschedule] = useState<Alert | null>(null);
    const [rescheduleDate, setRescheduleDate] = useState<string>('');
    const [isRescheduling, setIsRescheduling] = useState(false);

    const handleOpenCreate = useCallback(() => {
        setSelectedAlert(null);
        setIsDrawerOpen(true);
    }, []);

    const handleOpenEdit = useCallback((uid: string) => {
        const alert = alerts.find(a => a.uid === uid);
        if (alert) {
            setSelectedAlert(alert);
            setIsDrawerOpen(true);
        }
    }, [alerts]);

    const handleOpenReschedule = useCallback((uid: string) => {
        const alert = alerts.find(a => a.uid === uid);
        if (alert) {
            setAlertToReschedule(alert);
            setRescheduleDate(alert.sendAt ? new Date(alert.sendAt).toISOString().slice(0, 16) : '');
        }
    }, [alerts]);

    const handleConfirmDelete = useCallback(async () => {
        if (alertToDelete) {
            try {
                await deleteAlert(alertToDelete);
                setAlertToDelete(null);
            } catch (error) {
                console.error('Error deleting alert:', error);
            }
        }
    }, [alertToDelete, deleteAlert]);

    const handleConfirmReschedule = useCallback(async () => {
        if (alertToReschedule && rescheduleDate) {
            setIsRescheduling(true);
            try {
                const updatedPayload: GlobalAlertCreateRequest = {
                    title: alertToReschedule.title,
                    message: alertToReschedule.message,
                    icon: alertToReschedule.icon,
                    priority: alertToReschedule.priority,
                    isPinned: alertToReschedule.isPinned,
                    sendAt: new Date(rescheduleDate).toISOString()
                };
                await updateAlert(alertToReschedule.uid, updatedPayload);
                setAlertToReschedule(null);
                setRescheduleDate('');
            } catch (error) {
                console.error('Error rescheduling alert:', error);
            } finally {
                setIsRescheduling(false);
            }
        }
    }, [alertToReschedule, rescheduleDate, updateAlert]);

    const handleSubmitForm = useCallback(async (data: GlobalAlertCreateRequest) => {
        if (selectedAlert) {
            await updateAlert(selectedAlert.uid, data);
        } else {
            await createAlert(data);
        }
        setIsDrawerOpen(false);
    }, [selectedAlert, updateAlert, createAlert]);

    return {
        alerts,
        loading,
        isFetchingMore,
        hasMore,
        observerTarget,
        isRescheduling,
        isDrawerOpen,
        setIsDrawerOpen,
        alertToDelete,
        setAlertToDelete,
        alertToReschedule,
        setAlertToReschedule,
        selectedAlert,
        rescheduleDate,
        setRescheduleDate,
        handleOpenCreate,
        handleOpenEdit,
        handleOpenReschedule,
        handleConfirmDelete,
        handleConfirmReschedule,
        handleSubmitForm,
        togglePin
    };
};