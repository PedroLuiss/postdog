import { useState, useEffect, useMemo } from 'react';
import { GlobalAlertCreateRequest, GlobalAlertPriority, Alert } from '../../../../types/globalAlerts.type';
import { useNotification } from '../../../../context/NotificationContext';

interface UseGlobalAlertsModalFormProps {
    initialData?: Alert | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: GlobalAlertCreateRequest) => Promise<void>;
}

export const useGlobalAlertsModalForm = ({ initialData, isOpen, onClose, onSubmit }: UseGlobalAlertsModalFormProps) => {
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        sendDate: '',
        icon: 'truck',
        priority: 'LOW' as GlobalAlertPriority,
        isPinned: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (initialData) {
            setFormData({
                title: initialData.title || '',
                message: initialData.message || '',
                sendDate: initialData.sendAt ? new Date(initialData.sendAt).toISOString().slice(0, 16) : '',
                icon: initialData.icon || 'truck',
                priority: initialData.priority || 'MEDIUM',
                isPinned: !!initialData.isPinned
            });
        } else {
            setFormData({
                title: '',
                message: '',
                sendDate: '',
                icon: 'truck',
                priority: 'LOW',
                isPinned: false
            });
        }
        setShowErrors(false);
    }, [initialData, isOpen]);

    const hasBeenSent = useMemo(() => {
        if (!initialData || !initialData.sendAt) return false;
        return new Date(initialData.sendAt).getTime() <= new Date().getTime();
    }, [initialData]);

    const errors = useMemo(() => ({
        title: formData.title.trim() === '' ? 'El título es obligatorio' : undefined,
        message: formData.message.trim() === '' ? 'El mensaje es obligatorio' : undefined,
        sendDate: (!initialData && formData.sendDate === '') ? 'La fecha de envío es obligatoria' : undefined,
    }), [formData, initialData]);

    const isFormValid = useMemo(() => !Object.values(errors).some(err => err !== undefined), [errors]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: { target: { name: string, value: string | number } }) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const togglePinned = (val: boolean) => {
        setFormData(prev => ({ ...prev, isPinned: val }));
    };

    const setIcon = (iconName: string) => {
        setFormData(prev => ({ ...prev, icon: iconName }));
    };

    const handleSubmit = async () => {
        if (!isFormValid || hasBeenSent) {
            setShowErrors(true);
            showNotification("Datos incompletos", "Por favor completa todos los campos obligatorios.", 'error', 5000);
            return;
        }

        setIsLoading(true);
        try {
            const submitData: Partial<GlobalAlertCreateRequest> = {
                title: formData.title,
                message: formData.message,
                icon: formData.icon,
                priority: formData.priority,
                isPinned: formData.isPinned
            };

            if (!initialData) {
                submitData.sendAt = new Date(formData.sendDate).toISOString();
            }

            await onSubmit(submitData as GlobalAlertCreateRequest);
            showNotification("Éxito", initialData ? "Alerta actualizada correctamente." : "Alerta creada correctamente.", 'success', 5000);
            onClose();
        } catch (error: any) {
            console.error('Error submitting alert form:', error);
            showNotification("Error", error.response?.data?.message || "Ocurrió un error al procesar la solicitud.", 'error', 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        showErrors,
        errors,
        isFormValid,
        hasBeenSent,
        handleChange,
        handleSelectChange,
        togglePinned,
        setIcon,
        handleSubmit
    };
};