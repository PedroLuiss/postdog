import React, { ReactNode } from 'react';
import { Drawer, Box } from '@mui/material';
import { X } from 'lucide-react';
import styles from './DrawerModalUi.module.scss';
import { DrawerModalUiProps } from './types/DrawerModalUi.type';

const DrawerModalUi: React.FC<DrawerModalUiProps> = ({
    isOpen,
    onClose,
    title,
    headerNode,
    children,
    footer,
    maxWidth = '42rem',
    maxWidthLg = '1200px',
    className = '',
    showCloseButton = true,
    anchor = 'right',
    headerActions

}) => {
    return (
        <Drawer
            anchor={anchor}
            open={isOpen}
            onClose={onClose}
            transitionDuration={{ enter: 500, exit: 300 }}
            className={styles['drawer-root']}
            PaperProps={{
                style: {
                    '--drawer-max-width': maxWidth,
                    '--drawer-max-width-lg': maxWidthLg,
                } as React.CSSProperties
            }}
        >
            <Box
                className={`${styles['drawer-ui']} ${className}`}
                data-state={isOpen ? 'open' : 'closed'}
            >


                {(title || headerActions) && (
                    <header className={styles['drawer-ui__header']}>
                        <div >
                            {typeof title === 'string' ? (
                                <h2 className={styles['drawer-ui__title']}>{title}</h2>
                            ) : (
                                title
                            )}
                        </div>
                        <div className={styles['drawer-ui__header-actions']}>
                            {headerActions}
                            {showCloseButton && (
                                <button
                                    className={styles['drawer-ui__close-btn']}
                                    onClick={onClose}
                                    aria-label="Cerrar"
                                >
                                    <X />
                                </button>
                            )}
                        </div>
                    </header>
                )}

                {headerNode && (
                    headerNode
                )}

                <Box className={styles['drawer-ui__content']}>
                    {children}
                </Box>

                {footer && (
                    <footer className={styles['drawer-ui__footer']}>
                        {footer}
                    </footer>
                )}
            </Box>
        </Drawer>
    );
};

export default DrawerModalUi;