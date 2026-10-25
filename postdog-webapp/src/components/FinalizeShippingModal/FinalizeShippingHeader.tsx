import React from 'react';
import styles from './FinalizeShippingModal.module.scss';
import shopify from "../../assets/img/order/shopify.png";
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';

interface Props {
    onSave: () => void;
    onClose: () => void;
    loading?: boolean;
}

export const FinalizeShippingHeader: React.FC<Props> = ({ onSave, onClose, loading = false }) => (
    <header className={styles['finalize-shipping__header']}>
        <div className={styles['finalize-shipping__header-group']}>
            <h2 className={styles['finalize-shipping__title']}>Finaliza tu envío</h2>
            <div className={styles['finalize-shipping__order-details']}>
                <img src={shopify} className={styles['finalize-shipping__icon--lock']} alt="Shopify" />
                <span>Orden #144502</span>
                <span>14/08/2025 12:44 pm</span>
                <span className={`${styles['finalize-shipping__order-status']} ${styles['finalize-shipping__order-status--pending']}`}>Pendiente</span>
            </div>
        </div>
        <div className={styles['finalize-shipping__header-actions']}>
            <button onClick={onSave} disabled={loading} className={`${styles['finalize-shipping__button']} ${styles['finalize-shipping__button--save']}`}>
                {
                    loading
                        ? (<><CircularProgress color='inherit' size="0.9rem" /> Enviando...</>)
                        : " Guardar "
                }
            </button>
            <button onClick={onClose} className={`${styles['finalize-shipping__button']} ${styles['finalize-shipping__button--close']}`}>
                <CloseIcon />
            </button>
        </div>
    </header>
);