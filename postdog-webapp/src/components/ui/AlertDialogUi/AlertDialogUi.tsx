import React from 'react';
import { Dialog, Zoom } from '@mui/material';
import styles from './AlertDialogUi.module.scss';

interface AlertDialogUiProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    description?: string | React.ReactNode;
    children?: React.ReactNode;
    cancelLabel?: string;
    confirmLabel?: string;
    isLoading?: boolean;
    disabledConfirm?: boolean;
    hideConfirm?: boolean;
    showFooter?: boolean;
    classDialog?: string;
    classDialogContent?: string;
}

export const AlertDialogUi: React.FC<AlertDialogUiProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    children,
    cancelLabel = "Cancelar",
    confirmLabel = "Confirmar",
    isLoading = false,
    disabledConfirm = false,
    hideConfirm = false,
    showFooter = true,
    classDialog = '',
    classDialogContent = '',
}) => {

    const handleClose = (_: object, reason: string) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        onClose();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose} 
            TransitionComponent={Zoom}
            disableEscapeKeyDown
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: '#000c' }
                }
            }}
            PaperProps={{
                className: `${styles['alert-dialog']} ${classDialogContent}`
            }}
        >
            <div className={`${styles['alert-dialog__content']} ${classDialog}`}>
                <h2 className={styles['alert-dialog__title']}>{title}</h2>
                {description && <p className={styles['alert-dialog__description']}>{description}</p>}
                
                {children && <div className={styles['alert-dialog__custom-content']}>{children}</div>}
                
                {showFooter && (
                    <div className={styles['alert-dialog__actions']}>
                        <button 
                            type="button" 
                            className={styles['alert-dialog__btn-cancel']}
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelLabel}
                        </button>
                        {!hideConfirm && (
                            <button 
                                type="button" 
                                className={styles['alert-dialog__btn-confirm']}
                                onClick={() => onConfirm?.()}
                                disabled={isLoading || disabledConfirm}
                            >
                                {isLoading ? 'Cargando...' : confirmLabel}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </Dialog>
    );
};