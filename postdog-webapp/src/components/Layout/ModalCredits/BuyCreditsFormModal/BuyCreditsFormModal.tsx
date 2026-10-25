import React, { useState } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import ModalUi from '../../../ui/ModalUi/ModalUi';
import InputNumberUi from '../../../ui/inputNumberUI/InputNumberUi';
import styles from './StyleBuyCreditsModal/BuyCreditsFormModal.module.scss';
import { Elements } from '@stripe/react-stripe-js';
import { StripeTopUpForm } from './StripeTopUpForm';
import { useBuyCreditsForm } from './Hook/useBuyCreditsForm';
import { BuyCreditsFormModalProps } from './types/buy-credits.type';

export interface BuyCreditsFormModalPropsExtended extends Omit<BuyCreditsFormModalProps, 'onContinue'> {
    onSuccess?: () => void;
}


export const BuyCreditsFormModal: React.FC<BuyCreditsFormModalPropsExtended> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const {
        step,
        amount,
        handleAmountChange,
        handleAmountBlur,
        incrementAmount,
        decrementAmount,
        isAmountButtonDisabled,
        goToPayment,
        goBack,
        resetBuyCreditsForm,
        stripePromise,
        clientSecret,
        isIntentLoading,
        elementsOptions
    } = useBuyCreditsForm();

    const rawAmount = parseFloat(amount) || 0;

    return (
        <ModalUi
            isOpen={isOpen}
            onClose={onClose}
            className={step === 'payment' ? styles['expanded'] : ''}
        >
            <div className={styles['modal-body']}>
                <h2 className={styles['modal-title']}>Comprar créditos</h2>
                <p className={styles['subtitle']}>Selecciona tu forma de pago favorita.</p>

                {step === 'amount' ? (
                    <>
                        <div className={styles['amount-section']}>
                            <h3 className={styles['section-title__buy']}>Monto a depositar</h3>
                            <div className={styles['amount-input-wrapper']}>
                                <InputNumberUi
                                    placeholder="Monto: $0.00 MXN"
                                    value={amount}
                                    onChange={handleAmountChange}
                                    onBlur={handleAmountBlur}
                                    onIncrement={incrementAmount}
                                    onDecrement={decrementAmount}
                                />
                            </div>
                        </div>

                        <div className={styles['notice-card']}>
                            <div className={styles['notice-card__icon']}>
                                <Info size={20} />
                            </div>
                            <div className={styles['notice-card__text']}>
                                <strong>Nota sobre créditos:</strong>
                                <p>Al monto depositado se le descontará una pequeña comisión bancaria. Recibirás el saldo neto directamente en tus créditos.</p>
                            </div>
                        </div>

                        <button
                            className={styles['btn-continue']}
                            disabled={isAmountButtonDisabled}
                            onClick={goToPayment}
                        >
                            {isIntentLoading ? 'Procesando...' : 'Continuar al pago'}
                        </button>
                    </>
                ) : (
                    <>
                        <button className={styles['back-button']} onClick={goBack}>
                            <ArrowLeft size={16} />
                            Volver a editar monto
                        </button>

                        {isIntentLoading ? (
                            <div className={styles['info-box']} style={{ textAlign: 'center', marginTop: '30px' }}>
                                <p>Preparando entorno seguro de pago con Stripe...</p>
                            </div>
                        ) : clientSecret && stripePromise ? (
                            <Elements stripe={stripePromise} options={elementsOptions}>
                                <StripeTopUpForm
                                    depositTotal={rawAmount}
                                    onSuccess={onSuccess}
                                    onClose={onClose}
                                    onReset={resetBuyCreditsForm}
                                />
                            </Elements>
                        ) : (
                            <div className={styles['info-box']} style={{ textAlign: 'center', marginTop: '30px' }}>
                                <p>Error cargando la pasarela de pago. Intenta de nuevo.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ModalUi>
    );
};