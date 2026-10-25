import React, { useState } from 'react';
import ModalUi from '../../../../ui/ModalUi/ModalUi';


import { AutoBillingModalProps, AutoBillingMode } from '../../../Type/Billing.Type';
import styles from './AutoBillingModal.module.scss';

export const AutoBillingModal: React.FC<AutoBillingModalProps> = ({
    isOpen,
    onClose,
    onSave,
    currentMode
}) => {
    const [selectedMode, setSelectedMode] = useState<AutoBillingMode>(currentMode || 'recharge');

    const handleSave = () => {
        onSave(selectedMode);
    };

    return (
        <ModalUi
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="sm"
        >
            <div className={styles['modal-content']}>
                <div className={styles['modal-header']}>
                    <h2 className={styles['modal-title']}>Configurar facturación automática</h2>
                </div>

                <div className={styles['modal-body']}>
                    <div
                        className={`${styles['option-card']} ${selectedMode === 'recharge' ? styles['option-card--selected'] : ''}`}
                        onClick={() => setSelectedMode('recharge')}
                    >
                        <div className={`${styles['radio-indicator']} ${selectedMode === 'recharge' ? styles['radio-indicator--selected'] : ''}`} />
                        <div className={styles['option-info']}>
                            <span className={styles['option-label']}>Facturación por recarga</span>
                            <p className={styles['option-description']}>
                                Se generará automáticamente una factura cada vez que realices una recarga de saldo.
                            </p>
                        </div>
                    </div>

                    <div
                        className={`${styles['option-card']} ${selectedMode === 'monthly' ? styles['option-card--selected'] : ''}`}
                        onClick={() => setSelectedMode('monthly')}
                    >
                        <div className={`${styles['radio-indicator']} ${selectedMode === 'monthly' ? styles['radio-indicator--selected'] : ''}`} />
                        <div className={styles['option-info']}>
                            <span className={styles['option-label']}>Facturación mensual</span>
                            <p className={styles['option-description']}>
                                Se generará una sola factura global al final del mes con todas las recargas realizadas durante ese periodo.
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles['modal-footer']}>
                    <button className={`${styles['btn-modal']} ${styles['btn-modal--cancel']}`} onClick={onClose}>
                        Cancelar
                    </button>
                    <button className={`${styles['btn-modal']} ${styles['btn-modal--confirm']}`} onClick={handleSave}>
                        Guardar
                    </button>
                </div>
            </div>
        </ModalUi>
    );
};
