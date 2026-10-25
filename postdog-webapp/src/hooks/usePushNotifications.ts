import { useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { useNotification } from '../context/NotificationContext';

export const usePushNotifications = () => {
    const { showNotification } = useNotification();

    const registerDevice = useCallback(async () => {
        const token = await notificationService.requestPermission();
        if (token) {
            await notificationService.registerToken(token);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = notificationService.onMessageListener((payload) => {
            console.log('usePushNotifications: Mensaje recibido en primer plano:', payload);
            
            const title = payload.notification?.title || 'Nueva notificación';
            const body = payload.notification?.body || '';

            console.log('usePushNotifications: Mostrando toast:', { title, body });
            showNotification(title, body, 'info');
        });

        return () => {
            unsubscribe();
        };
    }, [showNotification]);

    return {
        registerDevice,
    };
};
