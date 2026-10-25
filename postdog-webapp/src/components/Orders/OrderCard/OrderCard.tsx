import React from 'react';

//styles
import styles from './OrderCard.module.scss';

//icons
import { TrashIcon } from '../../icons';

//types
import { DataOrder } from '../../../types/order.type';

//utils
import { FormattedDateUtils } from '../../../utils/FormattedDate.utils';
import { ImgUi } from '../../ui/ImgUi/ImgUi';



interface OrderCardProps {
    order: DataOrder;
    onDelete: (order: DataOrder) => void;
    onShip: (order: DataOrder) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onDelete, onShip }) => {
    return (
        <div className={styles['order-card-container']}>
            <div className={styles['order-card']}>
                <div className={styles['order-card__content']}>
                    <div className={styles['order-card__header']}>
                        <div className={styles['order-card__header-top']}>
                            <div className={styles['order-card__store-icon']}>
                                <ImgUi src={order.source?.logoUrl} alt={order.source?.platform} />
                            </div>
                            <span className={styles['order-card__order-number']}>{order.source?.identifier}</span>
                        </div>
                        <span className={styles['order-card__status-tag']}>Pedido pagado</span>
                    </div>

                    <div className={styles['order-card__details-grid']}>
                        <div className={styles['order-card__section']}>
                            <span className={styles['order-card__label']}>Destino</span>
                            <span className={styles['order-card__value']}>{order.destinationAddress?.fullName || 'N/A'}</span>
                            <span className={styles['order-card__sub-value']}>
                                {order.destinationAddress?.postalCode} - {order.destinationAddress?.colony}
                            </span>
                        </div>

                        <div className={styles['order-card__section']}>
                            <span className={styles['order-card__label']}>Productos</span>
                            <span className={styles['order-card__value']}>
                                {order.products.quantity} {order.products.quantity === 1 ? 'artículo' : 'artículos'}
                            </span>
                        </div>

                        <div className={styles['order-card__section']}>
                            <span className={styles['order-card__label']}>Tipo de envío</span>
                            <span className={styles['order-card__value-send']}>{order.quoteCarrier?.carrierName || 'N/A'}</span>
                            <span className={styles['order-card__sub-value']}>${order.quoteCarrier?.price || '0.00'}</span>
                        </div>
                    </div>

                    <div className={styles['order-card__footer']}>
                        {FormattedDateUtils(order.createdAt, "dd/MM/yyyy h:mm a")}
                    </div>
                </div>

                <div className={styles['order-card__actions']}>
                    <div className={styles['order-card__action-wrapper']}>
                        <button
                            className={styles['order-card__ship-button']}
                            onClick={() => onShip(order)}
                        >
                            Preparar envío
                        </button>
                    </div>
                    <div className={styles['order-card__action-wrapper']}>
                        <button
                            className={styles['order-card__delete-button']}
                            onClick={() => onDelete(order)}
                            title="Eliminar orden"
                        >
                            <TrashIcon fillColor="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
