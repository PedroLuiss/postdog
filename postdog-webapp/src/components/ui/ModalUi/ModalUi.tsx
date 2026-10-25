import React from 'react';
import { Dialog, Zoom } from '@mui/material';
import { X } from 'lucide-react';
import styles from './ModalUi.module.scss';

interface ModalUiProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    className?: string;
    closeButtonClassName?: string;
}

export const ModalUi: React.FC<ModalUiProps> = ({
    isOpen,
    onClose,
    children,
    maxWidth = 'sm',
    className,
    closeButtonClassName,
}) => {
    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            maxWidth={maxWidth}
            TransitionComponent={Zoom}
            slotProps={{
                backdrop: {
                    sx: { backgroundColor: '#000c', }
                }
            }}
            PaperProps={{
                className: `${styles['modal-container']} ${className || ''}`,
                'data-state': isOpen ? 'open' : 'closed'
            }}
        >
            <button
                className={`${styles['btn-close']} ${closeButtonClassName || ''}`}
                onClick={onClose}
                aria-label="Close"
            >
                <X size={16} />
            </button>
            {children}
        </Dialog>
    );
};

export default ModalUi;
