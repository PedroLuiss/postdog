import React from 'react';

//styles
import styles from './DeleteOrderModal.module.scss';

//types
import { DeleteOrderModalProps } from '../../../types/order.type';

export const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    orderNumber,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles['delete-modal__overlay']} onClick={onClose}>
            <div className={styles['delete-modal__container']} onClick={(e) => e.stopPropagation()}>

                <h3 className={styles['delete-modal__title']}>Eliminar orden</h3>
                <p className={styles['delete-modal__message']}>
                    Esta acción no se puede deshacer.
                </p>
                <p className={styles['delete-modal__subtitle']}>
                    Si eliminas esta orden:
                </p>
                <ul className={styles['delete-modal__list']}>
                    <li>Ya no podrás preparar un envío desde esta orden.</li>
                    <li>Si deseas enviar este pedido en el futuro, deberás crear el envío manualmente.</li>
                </ul>
                <div className={styles['delete-modal__actions']}>
                    <button
                        className={`${styles['delete-modal__button']} ${styles['delete-modal__button--cancel']}`}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        className={`${styles['delete-modal__button']} ${styles['delete-modal__button--confirm']}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Eliminando...' : 'Eliminar orden'}
                    </button>
                </div>
            </div>
        </div>
    );
};
