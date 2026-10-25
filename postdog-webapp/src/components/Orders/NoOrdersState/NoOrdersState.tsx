import React from 'react';
import styles from './NoOrdersState.module.scss';
import { NoOrdersStateProps } from '../../../types/order.type';
import { ClipboardListIcon, LittlePaw, } from '../../icons/IconOrders';

export const NoOrdersState: React.FC<NoOrdersStateProps> = ({
    onConnectStore,
    onSyncOrders,
    onCreateManualOrder
}) => {
    return (
        <div className={styles['no-orders']}>
            <div className={styles['no-orders__card']}>
                <div className={styles['no-orders__icon-container']}>
                    <div className={styles['no-orders__icon-circle']}>
                        <div className={styles['no-orders__main-icon']}>
                            <ClipboardListIcon size={40} color="white" />
                        </div>
                        <div className={styles['no-orders__sub-icon-circle']}>
                            <div className={styles['no-orders__sub-icon']}>
                                <LittlePaw size={16} color="#dc2626" />
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className={styles['no-orders__title']}>Sin órdenes por el momento</h2>
                <p className={styles['no-orders__description']}>
                    Integra tu tienda en línea y gestiona todas tus órdenes desde una sola plataforma,
                    o sincroniza las órdenes de tus tiendas ya integradas.
                </p>

                <div className={styles['no-orders__actions']}>
                    <button
                        className={`${styles['no-orders__button']} ${styles['no-orders__button--primary']} `}
                        onClick={onConnectStore}
                    >
                        Conectar tienda
                    </button>
                    <button
                        className={`${styles['no-orders__button']} ${styles['no-orders__button--secondary']} `}
                        onClick={onSyncOrders}
                    >
                        Sincronizar órdenes
                    </button>
                    <button
                        className={`${styles['no-orders__button']} ${styles['no-orders__button--secondary']} `}
                        onClick={onCreateManualOrder}
                    >
                        Crear envío manual
                    </button>
                </div>
            </div>
        </div>
    );
};
