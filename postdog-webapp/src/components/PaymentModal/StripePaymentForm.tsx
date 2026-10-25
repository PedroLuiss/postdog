import React, { useState } from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { useStripePayment } from '../../hooks/useStripePayment';
import { useNavigate } from 'react-router-dom';

import styles from './StripePaymentForm.module.scss';
import { BackArrowIcon, ErrorIcon, SuccessIcon } from '../icons';
import poweredbyStripe from "../../assets/Logos/poweredby-stripe.png";
import { formatCurrencyUtils } from '../../utils';
import { CardElementsState, IPayloadCreatePaymentIntent, PaymentStatus } from '../../types';
import { StripeCardNumberElementChangeEvent, StripeCardExpiryElementChangeEvent, StripeCardCvcElementChangeEvent } from '@stripe/stripe-js';
import { CustomAlert } from '../ui/CustomAlert';
import { useNotification } from '../../context/NotificationContext';

const stripeElementOptions = {
    style: {
        base: {
            color: '#1d1d1d',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': { color: '#8e8e93' },
        },
        invalid: { color: '#ff4d4f', iconColor: '#ff4d4f' },
        showIcon: true,
    },
};

interface StripePaymentFormProps {
    amount: number;
    onBack: () => void;
    paymentPayload: IPayloadCreatePaymentIntent;
    onPaymentComplete: () => void;
}

export const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onBack, paymentPayload, onPaymentComplete }) => {
    const navigate = useNavigate();
    const { isProcessing, errorMessage, handlePayment } = useStripePayment();
    const { showNotification } = useNotification();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
    const [formError, setFormError] = useState<string | null>(null);

    const [cardElementsComplete, setCardElementsComplete] = useState<CardElementsState>({
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false
    });

    const handleCardElementChange = (elementName: keyof CardElementsState) => (
        event: StripeCardNumberElementChangeEvent | StripeCardExpiryElementChangeEvent | StripeCardCvcElementChangeEvent
    ) => {
        if (formError) setFormError(null);

        setCardElementsComplete(prevState => ({
            ...prevState,
            [elementName]: event.complete
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const fullName = `${firstName} ${lastName}`.trim();
        const areCardDetailsComplete = Object.values(cardElementsComplete).every(isComplete => isComplete);

        if (!fullName || !areCardDetailsComplete) {
            setFormError('Por favor, completa todos los campos para continuar.');
            showNotification('Información incompleta', 'Por favor, completa todos los campos del formulario para continuar.', 'warning', 4000);
            return;
        }
        const result = await handlePayment({
            paymentPayload,
            cardholderName: fullName
        });

        if (result.success) {
            setPaymentStatus('success');
            showNotification('Pago exitoso', '¡Tu pago ha sido procesado correctamente!', 'success', 5000);
        } else {
            setPaymentStatus('error');
            showNotification(
                'Error al procesar el pago',
                errorMessage || 'Por favor, intenta de nuevo.',
                'error',
                8000
            );
        }
    };

    const handleRetry = () => {
        setPaymentStatus('idle');
        showNotification('Pago cancelado', 'Puedes intentar nuevamente con otra tarjeta si lo deseas.', 'info', 4000);
    };

    const goToOrders = () => {
        onPaymentComplete();
        navigate('/shipping/orders');
    };

    if (paymentStatus === 'success') {
        return (
            <div className={styles['payment-result']}>
                <SuccessIcon className={styles['payment-result__icon']} />
                <h2 className={styles['payment-result__title']}>¡Pago Exitoso!</h2>
                <p className={styles['payment-result__message']}>
                    Tu pago ha sido procesado correctamente, tu pedido está confirmado..
                </p>
                <button onClick={goToOrders} className={styles['payment-result__button']}>
                    Ver mis órdenes
                </button>
            </div>
        );
    }

    if (paymentStatus === 'error') {
        return (
            <div className={styles['payment-result']}>
                <ErrorIcon className={styles['payment-result__icon']} />
                <h2 className={styles['payment-result__title']}>Ocurrió un Error</h2>
                <p className={styles['payment-result__message']}>
                    {errorMessage || 'No pudimos procesar tu pago. Por favor, intenta de nuevo.'}
                </p>
                <div className={styles['payment-result__actions']}>
                    <button onClick={handleRetry} className={styles['payment-result__button']}>
                        Reintentar Pago
                    </button>
                    <button onClick={goToOrders} className={styles['payment-result__button']}>
                        Ir a mis órdenes
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <header className={styles['payment-form__header']}>
                <button onClick={onBack} className={styles['payment-form__back-button']}>
                    <BackArrowIcon />
                </button>
            </header>
            <div className={styles['payment-form']}>
                {(formError || (errorMessage && paymentStatus === 'idle')) &&

                    <CustomAlert severity="error" title="Error de Pago" onClose={() => { setFormError(null); }} sx={{ marginBottom: '16px' }}>
                        {formError || errorMessage}
                    </CustomAlert>
                }
                <form onSubmit={handleSubmit} className={styles['payment-form__form']}>
                    <div className={styles['payment-form__group']}>
                        <label htmlFor="card-number" className={styles['payment-form__label']}>
                            Número de la tarjeta
                        </label>
                        <div className={styles['payment-form__stripe-element-container']}>
                            <CardNumberElement
                                id="card-number"
                                options={{ ...stripeElementOptions, placeholder: 'Número de la tarjeta' }}
                                onChange={handleCardElementChange('cardNumber')}
                            />
                        </div>
                    </div>
                    <div className={styles['payment-form__group']}>
                        <label className={styles['payment-form__label']}>Nombre del titular de la tarjeta</label>
                        <div className={styles['payment-form__row']}>
                            <input type="text" placeholder="Nombre" value={firstName} onChange={(e) => setFirstName(e.target.value)} className={styles['payment-form__input']} required />
                            <input type="text" placeholder="Apellidos" value={lastName} onChange={(e) => setLastName(e.target.value)} className={styles['payment-form__input']} required />
                        </div>
                    </div>
                    <div className={styles['payment-form__row']}>
                        <div className={styles['payment-form__group']}>
                            <label htmlFor="card-expiry" className={styles['payment-form__label']}>Vence el</label>
                            <div className={styles['payment-form__stripe-element-container']}>
                                <CardExpiryElement
                                    id="card-expiry"
                                    options={stripeElementOptions}
                                    onChange={handleCardElementChange('cardExpiry')}
                                />
                            </div>
                        </div>
                        <div className={styles['payment-form__group']}>
                            <label htmlFor="card-cvc" className={styles['payment-form__label']}>CSC</label>
                            <div className={styles['payment-form__stripe-element-container']}>
                                <CardCvcElement
                                    id="card-cvc"
                                    options={stripeElementOptions}
                                    onChange={handleCardElementChange('cardCvc')}
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={isProcessing} className={styles['payment-form__submit-button']}>
                        {isProcessing ? 'Procesando...' : `Pagar ${formatCurrencyUtils(amount)}`}
                    </button>
                </form>
                <footer className={styles['payment-form__footer']}>
                    <img src={poweredbyStripe} className={styles['payment-form__footer__img-stripe']} alt="Powered by Stripe" />
                </footer>
            </div>
        </>
    );
};




