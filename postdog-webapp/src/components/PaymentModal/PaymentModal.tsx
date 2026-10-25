import React, { useState, useMemo, useEffect } from 'react';
import styles from './PaymentModal.module.scss';
import { CardIcon, CloseIcon } from '../icons';
import logoSpei from "../../assets/Logos/logospe.png";
import logoPaypal from "../../assets/Logos/logopaypal.png";
import { StripePaymentForm } from './StripePaymentForm';

import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../App';
import { IPayloadCreatePaymentIntent, PaymentMethod } from '../../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    quoteAmount: number;
    paymentPayload: IPayloadCreatePaymentIntent;
    onPaymentComplete: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, quoteAmount, paymentPayload, onPaymentComplete }) => {
    const [activeTab, setActiveTab] = useState<PaymentMethod>('card');

    const [amount, setAmount] = useState(quoteAmount);
    const [showStripeForm, setShowStripeForm] = useState(false);

    useEffect(() => {
        const initialAmount = Math.max(quoteAmount, 0);
        setAmount(initialAmount);
        if (isOpen) {
            setShowStripeForm(false);
        }
    }, [quoteAmount, isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Limpieza del efecto: removemos el event listener cuando el componente se desmonte o el modal se cierre
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    };

    const cardDetails = useMemo(() => {
        const commission = amount * 0.036 + 3.00;
        const totalReceived = amount - commission;
        return { commission, totalReceived };
    }, [amount]);

    const paypalDetails = useMemo(() => {
        const commission = amount * 0.0302 + 4.64;
        const totalReceived = amount - commission;
        return { commission, totalReceived };
    }, [amount]);

    const handleContinueToCardPayment = () => {
        setShowStripeForm(true);
    };

    if (!isOpen) {
        return null;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'card':
                return (
                    <>
                        <p className={styles['purchase-credits-modal__notice']}>
                            Pagos con tarjeta tienen una comisión del 3.6% + $3.00 MXN por transacción
                        </p>
                        <p className={styles['purchase-credits-modal__minimum']}>
                            Monto mínimo $500.00 MXN
                        </p>
                        <div className={styles['purchase-credits-modal__amount-group']}>
                            <label htmlFor="amount-card" className={styles['purchase-credits-modal__label']}>Cantidad:</label>
                            <div className={styles['purchase-credits-modal__input-container']}>
                                <span className={styles['purchase-credits-modal__currency-symbol']}>$</span>

                                <span className={styles['purchase-credits-modal__input']}>
                                    {amount} MXN
                                </span>
                            </div>
                        </div>
                        <div className={styles['purchase-credits-modal__details']}>
                            <span>Detalle del depósito</span>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>Depósito:</span>
                                <span>{formatCurrency(amount)}</span>
                            </div>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>Comisión:</span>
                                <span>{formatCurrency(cardDetails.commission)}</span>
                            </div>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>Total créditos recibidos:</span>
                                <span>{formatCurrency(cardDetails.totalReceived)}</span>
                            </div>
                        </div>
                        <button onClick={handleContinueToCardPayment} className={styles['purchase-credits-modal__button']}>Continuar</button>
                    </>
                );
            case 'spei':
                return (
                    <>
                        <p className={styles['purchase-credits-modal__notice']}>
                            Sin comisión. Verás tus créditos en máximo una hora.
                        </p>
                        <p className={styles['purchase-credits-modal__info-text']}>
                            La CLABE SPEI es exclusiva para tu cuenta. No la compartas.
                        </p>
                        <p className={styles['purchase-credits-modal__minimum']}>
                            Monto mínimo $500.00 MXN
                        </p>
                        <div className={styles['purchase-credits-modal__details']}>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>Banco:</span>
                                <span>STP</span>
                            </div>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>CLABE:</span>
                                <span>646180156905287680</span>
                            </div>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>Razón Social:</span>
                                <span>Postdog</span>
                            </div>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>RFC:</span>
                                <span>COMI011021HTSRRSA4</span>
                            </div>
                        </div>
                    </>
                );
            case 'paypal':
                return (
                    <>
                        <p className={styles['purchase-credits-modal__notice']}>
                            PayPal cobra un 3.02% + $4.64 por su servicio en cada transacción.
                        </p>
                        <p className={styles['purchase-credits-modal__minimum']}>
                            Monto mínimo $500.00 MXN
                        </p>
                        <div className={styles['purchase-credits-modal__amount-group']}>
                            <label htmlFor="amount-paypal" className={styles['purchase-credits-modal__label']}>Cantidad:</label>
                            <div className={styles['purchase-credits-modal__input-container']}>
                                <span className={styles['purchase-credits-modal__currency-symbol']}>$</span>

                                <span className={styles['purchase-credits-modal__input']}>
                                    {amount} MXN
                                </span>
                            </div>
                        </div>
                        <div className={styles['purchase-credits-modal__details']}>
                            <strong>Detalle del depósito</strong>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>Depósito:</span>
                                <span>{formatCurrency(amount)}</span>
                            </div>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <span>Comisión:</span>
                                <span>{formatCurrency(paypalDetails.commission)}</span>
                            </div>
                            <div className={styles['purchase-credits-modal__detail-row']}>
                                <strong>Total créditos recibidos:</strong>
                                <strong>{formatCurrency(paypalDetails.totalReceived)}</strong>
                            </div>
                        </div>
                        <button className={styles['purchase-credits-modal__button']}>Continuar</button>
                    </>
                );
            default:
                return null;
        }
    };


    return (
        <div className={styles['purchase-credits-modal__overlay']} >
            <div className={styles['purchase-credits-modal__container']} onClick={(e) => e.stopPropagation()}>
                {showStripeForm ? (
                    <Elements stripe={stripePromise}>
                        <StripePaymentForm
                            amount={amount}
                            onBack={() => setShowStripeForm(false)}
                            paymentPayload={paymentPayload}
                            onPaymentComplete={onPaymentComplete}
                        />
                    </Elements>
                ) : (<>

                    <header className={styles['purchase-credits-modal__header']}>
                        <h2 className={styles['purchase-credits-modal__title']}>Comprar créditos</h2>
                        <button onClick={onClose} className={styles['purchase-credits-modal__close-button']}>
                            <CloseIcon />
                        </button>
                    </header>

                    <p className={styles['purchase-credits-modal__subtitle']}>Selecciona tu forma de pago favorita.</p>

                    <div className={styles['purchase-credits-modal__tabs']}>
                        <button
                            className={`${styles['purchase-credits-modal__tab']} ${activeTab === 'card' ? styles['purchase-credits-modal__tab--active'] : ''}`}
                            onClick={() => setActiveTab('card')}
                        >
                            <CardIcon fillColor='#FFFFFF' />
                            <span>Tarjeta</span>
                        </button>
                        <button
                            className={`${styles['purchase-credits-modal__tab']} ${activeTab === 'spei' ? styles['purchase-credits-modal__tab--active'] : ''}`}
                            onClick={() => setActiveTab('spei')}
                        >
                            <img src={logoSpei} className={styles['purchase-credits-modal__tab--logospai']} />
                        </button>
                        <button
                            className={`${styles['purchase-credits-modal__tab']} ${activeTab === 'paypal' ? styles['purchase-credits-modal__tab--active'] : ''}`}
                            onClick={() => setActiveTab('paypal')}
                        >

                            <img src={logoPaypal} className={styles['purchase-credits-modal__tab--logo-paypal']} />
                        </button>
                    </div>

                    <div className={styles['purchase-credits-modal__content']}>
                        {renderContent()}
                    </div>


                </>)}

            </div>
        </div>
    );
};