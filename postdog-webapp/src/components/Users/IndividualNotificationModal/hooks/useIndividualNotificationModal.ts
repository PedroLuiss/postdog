import { useState } from 'react';
import { AdminUserService } from '../../../../services/AdminUserService';
import { useNotification } from '../../../../context/NotificationContext';

interface UseIndividualNotificationModalProps {
    user: any;
    onClose: () => void;
    userIds?: string[];
}

export const useIndividualNotificationModal = ({ user, onClose, userIds }: UseIndividualNotificationModalProps) => {
    const { showNotification } = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        icon: 'bell'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const setIcon = (iconId: string) => {
        setFormData(prev => ({ ...prev, icon: iconId }));
    };

    const handleSend = async () => {
        if (!formData.title || !formData.message) {
            showNotification('Atención', 'Por favor completa todos los campos', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            if (userIds && userIds.length > 0) {
                // Modo Masivo
                await AdminUserService.bulkAction('SEND_NOTIFICATION', userIds, {
                    notificationTitle: formData.title,
                    notificationMessage: formData.message,
                    notificationIcon: formData.icon
                });
                showNotification('Éxito', `Notificación enviada a ${userIds.length} usuarios`, 'success');
            } else {
                // Modo Individual
                await AdminUserService.notify(user.uid, formData);
                showNotification('Éxito', 'Notificación enviada correctamente', 'success');
            }
            
            setFormData({ title: '', message: '', icon: 'bell' });
            onClose();
        } catch (error) {
            showNotification('Error', 'No se pudo enviar la notificación', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        isLoading,
        handleChange,
        setIcon,
        handleSend
    };
};
