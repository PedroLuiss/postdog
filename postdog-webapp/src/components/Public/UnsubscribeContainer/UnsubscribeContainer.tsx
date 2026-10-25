import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import styles from './UnsubscribeContainer.module.scss';
import { UnsubscribeContainerProps } from './types';

export const UnsubscribeContainer: React.FC<UnsubscribeContainerProps> = ({
    status,
    handleConfirm,
    handleCancel,
    goToHome,
    resetStatus
}) => {
    return (
        <main className={styles['unsubscribe-container']}>
            <motion.div 
                className={styles['unsubscribe-container__card']}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {status === 'verifying' ? (
                    <div className={styles['unsubscribe-container__verifying']}>
                        <div className={styles['unsubscribe-container__loader']}></div>
                        <p>Verificando tu solicitud...</p>
                    </div>
                ) : status === 'idle' || status === 'loading' ? (
                    <>
                        <h1 className={styles['unsubscribe-container__title']}>
                            ¿Estás seguro de que quieres dejar de recibir nuestras notificaciones?
                        </h1>
                        
                        <p className={styles['unsubscribe-container__description']}>
                            Dejarás de recibir actualizaciones sobre tus envíos, promociones y noticias importantes de Postdog.
                        </p>

                        <div className={styles['unsubscribe-container__actions']}>
                            <button 
                                className={styles['unsubscribe-container__btn-confirm']}
                                onClick={handleConfirm}
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Procesando...' : 'Anular suscripción'}
                            </button>
                            <button 
                                className={styles['unsubscribe-container__btn-cancel']}
                                onClick={handleCancel}
                                disabled={status === 'loading'}
                            >
                                Cancelar
                            </button>
                        </div>
                    </>
                ) : status === 'success' ? (
                    <motion.div 
                        className={styles['unsubscribe-container__success']}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                    >
                        <CheckCircle2 size={64} className={styles['unsubscribe-container__icon-success']} />
                        <h2>Suscripción anulada</h2>
                        <p>Ya no recibirás más correos electrónicos de nuestra parte.</p>
                        <button className={styles['unsubscribe-container__btn-home']} onClick={goToHome}>
                            Volver al inicio
                        </button>
                    </motion.div>
                ) : (
                    <div className={styles['unsubscribe-container__error']}>
                        <XCircle size={64} className={styles['unsubscribe-container__icon-error']} />
                        <h2>Algo salió mal</h2>
                        <p>No pudimos procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.</p>
                        <button className={styles['unsubscribe-container__btn-retry']} onClick={resetStatus}>
                            Reintentar
                        </button>
                    </div>
                )}
            </motion.div>
        </main>
    );
};
