import React from 'react';
import { Drawer } from '@mui/material';
import { X, Shield } from 'lucide-react';
import styles from './AddInsuranceDrawer.module.scss';
import ButtonUi from '../../ui/Button/ButtonUi';
import { useAddInsuranceDrawer } from './hooks/useAddInsuranceDrawer';
import InputUi from '../../ui/Input/InputUi';

interface AddInsuranceDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    shipmentData: any;
    onSuccess?: () => void;
}

export const AddInsuranceDrawer: React.FC<AddInsuranceDrawerProps> = ({ isOpen, onClose, shipmentData, onSuccess }) => {
    const {
        isActive,
        handleToggleActive,
        declaredValue,
        handleValueChange,
        shippingPrice,
        insuranceCost,
        newTotal,
        isSubmitting,
        handleSubmit,
        fieldError,
        isValueValid
    } = useAddInsuranceDrawer({ shipmentData, isOpen, onClose, onSuccess });

    if (!shipmentData) return null;

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '100%',
                    maxWidth: { xs: '100vw', sm: '28rem' },
                    height: '100dvh',
                },
                '& .MuiBackdrop-root': { backgroundColor: '#000c' },
            }}
        >
            <div className={styles['insurance-drawer']}>
                <button className={styles['insurance-drawer__close-btn']} onClick={onClose}>
                    <X size={20} />
                </button>

                <header className={styles['insurance-drawer__header']}>
                    <div className={styles['insurance-drawer__header-content']}>
                        <Shield size={20} className={styles['insurance-drawer__icon-shield']} />
                        <h2 className={styles['insurance-drawer__title']}>Agregar Seguro PawSafe</h2>
                    </div>
                </header>

                <div className={styles['insurance-drawer__body']}>
                    <div className={styles['insurance-drawer__stack']}>

                        <div className={styles['insurance-card']}>
                            <h3 className={styles['insurance-card__title']}>Información actual</h3>
                            <div className={styles['insurance-card__row']}>
                                <span className={styles['insurance-card__label']}>Envío:</span>
                                <span className={styles['insurance-card__value']}>${shippingPrice.toFixed(2)} MXN</span>
                            </div>
                            <div className={styles['insurance-card__row'] + ' mb-0'}>
                                <span className={styles['insurance-card__label']}>Seguro actual:</span>
                                <span className={styles['insurance-card__value']}>$0.00 MXN</span>
                            </div>
                        </div>

                        <div className={`${styles['insurance-card']} ${styles['insurance-card--form']}`}>
                            <div className={styles['insurance-card__checkbox-group']}>
                                <input
                                    type="checkbox"
                                    id="activate-insurance"
                                    checked={isActive}
                                    onChange={handleToggleActive}
                                    className={styles['insurance-card__checkbox']}
                                />
                                <div className={styles['insurance-card__checkbox-text']}>
                                    <label htmlFor="activate-insurance">Activar Seguro PawSafe</label>
                                    <p>Protección en caso de robo, extravío, daño y mucho más</p>
                                </div>
                            </div>

                            {isActive && (
                                <div className={styles['insurance-card__input-section']}>
                                    <InputUi
                                        label="Valor declarado*"
                                        name="declaredValue"
                                        type="number"
                                        placeholder="0.00"
                                        value={declaredValue}
                                        onChange={handleValueChange}
                                        error={fieldError}
                                        suffixIcon={<span className={styles['insurance-card__unit']}>MXN</span>}
                                        isValid={isValueValid}
                                        showMessageError={false}
                                    />
                                </div>
                            )}
                        </div>

                        <div className={styles['insurance-card']}>
                            <div className={styles['insurance-card__row']}>
                                <span className={styles['insurance-card__label']}>Envío:</span>
                                <span className={styles['insurance-card__value']}>${shippingPrice.toFixed(2)} MXN</span>
                            </div>
                            <div className={styles['insurance-card__row']}>
                                <span className={styles['insurance-card__label']}>Seguro PawSafe:</span>
                                <span className={styles['insurance-card__value']}>${(isActive ? insuranceCost : 0).toFixed(2)} MXN</span>
                            </div>
                            <div className={`${styles['insurance-card__row']} ${styles['insurance-card__row--total']}`}>
                                <span className={styles['insurance-card__total-label']}>Nuevo total:</span>
                                <span className={styles['insurance-card__total-value']}>${newTotal.toFixed(2)} MXN</span>
                            </div>
                        </div>

                    </div>
                </div>

                <footer className={styles['insurance-drawer__footer']}>
                    <ButtonUi
                        variant="primary"
                        fullWidth
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                    >
                        Agregar seguro
                    </ButtonUi>
                </footer>
            </div>
        </Drawer>
    );
};