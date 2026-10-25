import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { usePushNotifications } from '../../hooks/usePushNotifications';

export const PushNotificationManager: React.FC = () => {
    const { user } = useAppContext();
    const { registerDevice } = usePushNotifications();


    useEffect(() => {
        if (user && user.access_token) {
            registerDevice();
        }
    }, [user, registerDevice]);

    return null;
};
