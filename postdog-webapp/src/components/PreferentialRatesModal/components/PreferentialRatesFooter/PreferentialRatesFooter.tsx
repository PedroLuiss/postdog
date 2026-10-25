import React from 'react';
import { PreferentialRatesFooterProps } from '../../Type/PreferentialRatesModal.Type';
import styles from '../../PreferentialRatesModal.module.scss';
import { SendIcon } from '../../../icons/SendIcon';

export const PreferentialRatesFooter: React.FC<PreferentialRatesFooterProps> = ({ onContactSales }) => (
    <div className={styles['modal-footer']} >
        <button
            onClick={onContactSales}
            className={styles['btn-principal']}
        >
            <SendIcon className={styles['icon-ventas']} />
            Contactar con ventas
        </button>
    </div>
);