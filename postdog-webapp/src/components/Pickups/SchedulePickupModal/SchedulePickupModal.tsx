import React from 'react';

import { Drawer, Box } from '@mui/material';

import styles from './SchedulePickupModal.module.scss';

import { CloseIcon } from '../../icons';

import SelectUi from '../../ui/SelectUi/SelectUi';
import InputUi from '../../ui/Input/InputUi';

import { SchedulePickupModalProps } from '../../../types';

export const SchedulePickupModal: React.FC<SchedulePickupModalProps> = ({
    isOpen,
    onClose,
    formData,
    onInputChange,
    onSubmit,
    carrierOptions,
    referenceOrderOptions,
    pickupDateOptions,
    isFormValid,
    isLoading,
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
            <Box className={styles['schedule-pickup']}>
                <div className={styles['schedule-pickup__header']}>
                    <h2 className={styles['schedule-pickup__title']}>Programa tu recolección</h2>
                    <button onClick={onClose} className={styles['schedule-pickup__close-button']}>
                        <CloseIcon />
                    </button>
                </div>
                <div className={styles['schedule-pickup__content']}>
                    <div className={styles['schedule-pickup__section-carrier']}>
                        <div className={styles['schedule-pickup__card-carrier']}>
                            <SelectUi
                                className={styles['schedule-pickup__select-carrier']}
                                containerClassName={styles['schedule-pickup__select-container']}
                                label={<>Paquetería<span className={styles['schedule-pickup__asterisk']}>*</span></>}
                                placeholder="Elige una paquetería"
                                options={carrierOptions}
                                value={formData.carrier}
                                onChange={(e) => onInputChange('carrier', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles['schedule-pickup__section-details']}>
                        <div className={styles['schedule-pickup__card-details']}>
                            <h3 className={styles['schedule-pickup__title-details']}>Todo sobre tu recolección</h3>
                            <div className={styles['schedule-pickup__form-details']}>
                                <div className={styles['schedule-pickup__field-reference']}>
                                    <SelectUi
                                        className={styles['schedule-pickup__select-reference']}
                                        containerClassName={styles['schedule-pickup__select-container']}
                                        label={<>Envío de referencia<span className={styles['schedule-pickup__asterisk']}>*</span></>}
                                        placeholder={formData.carrier ? "Seleccionar envío" : "Selecciona primero una paquetería"}
                                        options={referenceOrderOptions}
                                        disabled={!formData.carrier}
                                        value={formData.referenceOrder}
                                        onChange={(e) => onInputChange('referenceOrder', e.target.value)}
                                    />
                                    <p className={styles['schedule-pickup__info-text']}>
                                        No es necesario programar una recolección por cada envío. Solo debes programar una recolección por paquetería, y podrás entregar al repartidor la cantidad de paquetes que desees.
                                    </p>
                                    <div className={styles['schedule-pickup__field-address']}>
                                        <InputUi
                                            className={styles['schedule-pickup__input-address']}
                                            containerClassName={styles['schedule-pickup__select-container']}
                                            label={<>Dirección de recolección<span className={styles['schedule-pickup__asterisk']}>*</span></>}
                                            placeholder="Ingresa la dirección completa"
                                            value={formData.pickupAddress}
                                            disabled={true}
                                            onChange={(e) => onInputChange('pickupAddress', e.target.value)}
                                        />
                                    </div>

                                    <div className={styles['schedule-pickup__field-date']}>
                                        <SelectUi
                                            className={styles['schedule-pickup__select-date']}
                                            containerClassName={styles['schedule-pickup__select-container']}
                                            label={<>Fecha de recolección<span className={styles['schedule-pickup__asterisk']}>*</span></>}
                                            placeholder="Selecciona una fecha"
                                            options={pickupDateOptions}
                                            value={formData.pickupDate}
                                            onChange={(e) => onInputChange('pickupDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            className={styles['schedule-pickup__submit-button']}
                            onClick={() => onSubmit(formData)}
                            disabled={!isFormValid || isLoading}
                        >
                            {isLoading ? 'Programando...' : 'Programar recolección'}
                        </button>
                    </div>
                </div>
            </Box>
        </Drawer>
    );
};
