//react
import React from 'react';

//mui
import { Drawer, Box } from '@mui/material';

//icons
import { CloseIcon } from '../../icons';

//types
import { OrdersModalProps } from '../../../types';

//style
import styles from './OrdersModal.module.scss';

export const OrdersModal: React.FC<OrdersModalProps> = ({
    isOpen,
    onClose,
}) => {
    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            classes={{
                root: styles['drawer-root'],
                paper: styles['drawer-paper'],
            }}
            transitionDuration={{ enter: 200, exit: 200 }}
            SlideProps={{
                easing: {
                    enter: 'cubic-bezier(0, 0, 0.2, 1)',
                    exit: 'cubic-bezier(0.4, 0, 1, 1)',
                },
            }}
        >
            <Box className={styles['orders-modal']}>
                <div className={styles['orders-modal__header']}>
                    <h2 className={styles['orders-modal__title']}>Importar envíos</h2>
                    <button onClick={onClose} className={styles['orders-modal__close-button']}>
                        <CloseIcon />
                    </button>
                </div>
                <div className={styles['orders-modal__content']}>
                    {/* Content will be added later */}
                </div>
            </Box>
        </Drawer>
    );
};
