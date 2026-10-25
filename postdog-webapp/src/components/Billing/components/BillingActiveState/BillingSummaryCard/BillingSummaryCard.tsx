import React from 'react';
import { ReceiptIcon } from '../../../icons/BillingIcons';
import { BillingSummaryCardProps } from '../../../Type/Billing.Type';
import styles from './BillingSummaryCard.module.scss';
import { formatCurrency } from '../../../../../utils/FormatCurrency.utils';


export const BillingSummaryCard: React.FC<BillingSummaryCardProps> = ({
    subtotal,
    iva,
    total,
    currency,
    onEmit,
    isEmitting
}) => {


    return (
        <div className={styles['info-card']}>
            <div className={styles['header-flex']}>
                <div className={styles['icon-box-minimal']}>
                    <ReceiptIcon />
                </div>
                <h3 className={styles['header-title']}>Resumen de facturación</h3>
            </div>

            <div className={styles['items-container']}>
                <div className={styles['row-flex']}>
                    <span className={styles['label-xs']}>Moneda de emisión</span>
                    <span className={styles['value-sm']}>{currency}</span>
                </div>
                <div className={styles['row-flex']}>
                    <span className={styles['label-xs']}>Subtotal</span>
                    <span className={styles['value-sm']}>${formatCurrency(subtotal)}</span>
                </div>
                <div className={styles['row-flex']}>
                    <span className={styles['label-xs']}>IVA trasladado</span>
                    <span className={styles['value-sm']}>${formatCurrency(iva)}</span>
                </div>

                <div className={styles['mini-divider']} />

                <div className={styles['row-flex']}>
                    <span className={styles['font-semibold']}>Total</span>
                    <span className={styles['font-bold-lg']}>${formatCurrency(total)}</span>
                </div>
            </div>

            <button
                className={styles['btn-primary-red']}
                onClick={onEmit}
                disabled={total === 0 || isEmitting}
            >
                {isEmitting ? 'Emitiendo...' : 'Emitir factura'}
            </button>
        </div>
    );
};
