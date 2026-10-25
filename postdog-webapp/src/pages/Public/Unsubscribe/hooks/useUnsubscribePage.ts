import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UnsubscribeService from '../../../../services/UnsubscribeService';

export type UnsubscribeStatus = 'idle' | 'loading' | 'success' | 'error' | 'verifying';

export const useUnsubscribePage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const email = searchParams.get('email') || '';
    const token = searchParams.get('token') || '';
    const [status, setStatus] = useState<UnsubscribeStatus>('verifying');

    const verifyToken = useCallback(async () => {
        if (!email || !token) {
            setStatus('error');
            return;
        }

        try {
            const response = await UnsubscribeService.verifyToken(email, token);
            if (response.success || response.valid) {
                setStatus('idle');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
            console.error("Error al verificar token:", error);
        }
    }, [email, token]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    const handleConfirm = async () => {
        setStatus('loading');
        try {
            await UnsubscribeService.unsubscribe(email, token);
            setStatus('success');
        } catch (error) {
            setStatus('error');
            console.error("Error al anular suscripción:", error);
        }
    };

    const handleCancel = () => {
        navigate('/');
    };

    const goToHome = () => {
        navigate('/');
    };

    const resetStatus = () => {
        verifyToken();
    };

    return {
        email,
        status,
        handleConfirm,
        handleCancel,
        goToHome,
        resetStatus
    };
};