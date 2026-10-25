import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNotification } from '../../../../context/NotificationContext';
import styles from './StyleBuyCreditsModal/BuyCreditsFormModal.module.scss';
import { useWalletContext } from '../../../../context/WalletContext';

export interface StripeTopUpFormProps {
    onSuccess?: () => void;
    onClose: () => void;
    onReset?: () => void;
    depositTotal: number;
}

export const StripeTopUpForm: React.FC<StripeTopUpFormProps> = ({ onSuccess, onClose, onReset, depositTotal }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { showNotification } = useNotification();
    const { addOptimisticBalance } = useWalletContext();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required',
        });

        if (error) {
            showNotification('Error procesando pago', error.message || 'La transacción ha fallado', 'error');
            setIsProcessing(false);
        } else {
            showNotification('Recarga exitosa', 'Tus créditos han sido actualizados', 'success');

            addOptimisticBalance(depositTotal);
            window.dispatchEvent(new CustomEvent('wallet-updated'));

            if (onReset) onReset();
            if (onSuccess) onSuccess();
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
            <PaymentElement options={{
                layout: 'tabs',
            }} />

            <button
                className={styles['btn-continue']}
                disabled={isProcessing || !stripe || !elements}
                type="submit"
                style={{ marginTop: '24px' }}
            >
                {isProcessing ? 'Procesando pago...' : `Pagar $${depositTotal.toFixed(2)} MXN`}
            </button>
        </form>
    );
};
