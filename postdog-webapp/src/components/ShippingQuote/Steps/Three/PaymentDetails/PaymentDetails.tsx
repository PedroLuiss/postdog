import React from 'react';
import styles from './PaymentDetails.module.scss';
import { BarcodeIcon } from '../../../../icons';
import PetsIcon from '@mui/icons-material/Pets';
import { useShippingQuoteDrawer } from '../../../../../context';
import { CircularProgress } from '@mui/material';

interface PaymentDetailsProps {
    shippingCost: number;
    isPawSafeActive: boolean;
    onPawSafeToggle: (isActive: boolean) => void;
    declaredValue: string;
    onDeclaredValueChange: (value: string) => void;
    error?: string;
    loading?: boolean;
    handleSend: () => void;
}

export const PaymentDetails: React.FC<PaymentDetailsProps> = ({
    shippingCost,
    isPawSafeActive,
    onPawSafeToggle,
    declaredValue,
    onDeclaredValueChange,
    error,
    handleSend,
    loading = false
}) => {

    const { longingBtnSend } = useShippingQuoteDrawer();

    const declaredAmount = isPawSafeActive && declaredValue !== "" ? parseFloat(declaredValue) : 0;
    const total = shippingCost + declaredAmount;

    return (
        <div className={styles['payment-details']}>
            <h3 className={styles['payment-details__title']}>
                <BarcodeIcon /> Detalles de pago
            </h3>

            <div className={styles['pawsafe-toggle']}>
                <div className={styles['pawsafe-toggle__box-checkbox']}>
                    <input
                        type="checkbox"
                        id="pawsafe-checkbox"
                        checked={isPawSafeActive}
                        onChange={(e) => onPawSafeToggle(e.target.checked)}
                        className={styles['pawsafe-toggle__checkbox']}
                    />
                    <label htmlFor="pawsafe-checkbox" className={styles['pawsafe-toggle__label']}>
                        PawSafe
                    </label>
                </div>
                <div className={styles['pawsafe-toggle__box-descripcion']}>
                    <PetsIcon className={styles['pawsafe-toggle__box-descripcion__icon']} />
                    <p className={styles['pawsafe-toggle__description']}>
                        Activa PawSafe y te daremos la pata si algo sale mal. Te apoyamos en caso de pérdida, daño o robo durante el envío.
                    </p>
                </div>
            </div>
            <div className={styles['summary-wrapper']}>
                {isPawSafeActive && (
                    <div className={styles['declared-value']}>
                        <label htmlFor="declared-value" className={styles['declared-value__label']}>Valor declarado{ }</label>
                        <div className={`${styles['declared-value__input-wrapper']} ${error ? styles['input-wrapper--error'] : ''}`}>
                            <span>$</span>
                            <input
                                type="text"
                                id="declared-value"
                                value={declaredValue}
                                onChange={(e) => onDeclaredValueChange(e.target.value)}
                            />
                            <span>MXN</span>
                        </div>
                        {error ? (
                            <p className={styles['error-message']}>{error}</p>
                        ) : (
                            <p className={styles['declared-value__helper']}>Especifica un monto de $100 MXN a $100,000 MXN.</p>
                        )}
                    </div>
                )}

                <div className={styles['summary']}>
                    <div className={styles['summary__item']}>
                        <span>Envío</span>
                        <span>${shippingCost.toFixed(2)} MXN</span>
                    </div>
                    {isPawSafeActive && (
                        <div className={styles['summary__item']}>
                            <span>PawSafe</span>
                            <span>${declaredAmount.toFixed(2)} MXN</span>
                        </div>
                    )}
                    <div className={`${styles['summary__item']} ${styles['summary__item--total']}`}>
                        <span>Total:</span>
                        <span>${total.toFixed(2)} MXN</span>
                    </div>
                    <p className={styles['summary__iva']}>(Incluye IVA)</p>
                </div>
            </div>

            <div className={styles['footer']}>
                <p className={styles['footer__terms']}>
                    Al generar el envío, confirmo que he leído y acepto los <span>términos y políticas</span>.
                </p>
                <button type='button' disabled={longingBtnSend || loading} onClick={handleSend} className={styles['footer__button']}>
                    {
                        longingBtnSend || loading
                            ? (<><CircularProgress color='inherit' size="1.5rem" /> Enviando...</>)
                            : " Enviar "
                    }
                </button>
            </div>
        </div>
    );
};