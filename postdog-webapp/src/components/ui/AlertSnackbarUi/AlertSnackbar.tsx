import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import {
    AlertCircle,
    CheckCircle2,
    Info,
    AlertTriangle,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AlertSnackbar.module.scss';

interface AlertSnackbarProps {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    severity?: 'success' | 'error' | 'warning' | 'info';
    autoHideDuration?: number;
}

const iconMap = {
    success: <CheckCircle2 />,
    error: <AlertCircle />,
    warning: <AlertTriangle />,
    info: <Info />
};

export const AlertSnackbar: React.FC<AlertSnackbarProps> = ({
    open,
    title,
    description,
    onClose,
    severity = 'success',
    autoHideDuration = 5000,
}) => {
    const handleClose = (
        _?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') return;
        onClose();
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
                '& .MuiPaper-root': { background: 'none', boxShadow: 'none', padding: 0 },
                '@media (max-width: 640px)': {
                    left: '50% !important',
                    right: 'auto !important',
                    transform: 'translateX(-50%) !important',
                    top: '1rem !important',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                }
            }}
        >
            <div style={{ pointerEvents: 'none' }}>
                <AnimatePresence>
                    {open && (
                        <motion.div
                            className={styles.toast}
                            role="alert"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.7}
                            onDragEnd={(_, info) => {
                                if (Math.abs(info.offset.x) > 100) {
                                    onClose();
                                }
                            }}
                            whileDrag={{ cursor: 'grabbing' }}
                            style={{ pointerEvents: 'auto' }}
                        >
                            <div className={`${styles.toast__icon} ${styles[`toast__icon--${severity}`]}`}>
                                {iconMap[severity]}
                            </div>
                            <div className={styles.toast__content}>
                                <h4 className={styles.toast__title}>{title}</h4>
                                {description && (
                                    <p className={styles.toast__description}>{description}</p>
                                )}
                            </div>
                            <button
                                className={styles.toast__close}
                                onClick={onClose}
                                aria-label="Cerrar notificación"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Snackbar>
    );
};