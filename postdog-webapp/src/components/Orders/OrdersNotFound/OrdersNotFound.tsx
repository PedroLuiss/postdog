import React from 'react';

// Styles
import styles from './OrdersNotFound.module.scss';

// Components
import { SearchIcon } from '../../icons';

// Hooks
import { useOrdersNotFound } from '../../../hooks/useOrdersNotFound';

// Types
import { OrdersNotFoundProps } from '../../../types/orders-not-found.type';

export const OrdersNotFound: React.FC<OrdersNotFoundProps> = (props) => {
    const { handleResetSearch } = useOrdersNotFound(props);

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.icon}>
                    <SearchIcon />
                </div>
                <div className={styles.content_text}>
                    <h2 className={styles.title}>No se encontraron órdenes</h2>
                    <p className={styles.description}>
                        No hay órdenes que coincidan con los filtros o búsqueda aplicados. Intenta ajustar
                        los criterios.
                    </p>
                </div>
                <div className={styles.content_button}>
                    <button className={styles.button} onClick={handleResetSearch}>
                        Limpiar búsqueda
                    </button>
                </div>
            </div>
        </div>
    );
};
