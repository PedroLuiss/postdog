import React from 'react';
import { Drawer } from '@mui/material';
import { X, Copy, Check, TriangleAlert } from 'lucide-react';
import styles from './CancelShipmentDrawer.module.scss';
import ButtonUi from '../../ui/Button/ButtonUi';
import { useCancelShipmentModalDrawer } from './hooks/useCancelShipmentModalDrawer';
import TextareaUi from '../../ui/TextareaUi/TextareaUi';
import { RadioUi } from '../../ui/SelectionUi';

interface CancelShipmentDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    shipmentData: any;
    onSuccess?: () => void;
}

export const CancelShipmentDrawer: React.FC<CancelShipmentDrawerProps> = ({ isOpen, onClose, shipmentData, onSuccess }) => {
    const {
        selectedReason,
        setSelectedReason,
        isCopied,
        isSubmitting,
        reasons,
        handleCopy,
        onSubmit,
        otherReasonDetails,
        setOtherReasonDetails
    } = useCancelShipmentModalDrawer({ shipmentData, onClose, onSuccess });

    if (!shipmentData) return null;

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '100%',
                    maxWidth: { xs: '100vw', sm: '32rem' },
                    height: '100dvh',
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: '#000c',
                },
            }}
        >
            <div className={styles['cancel-drawer']}>
                <button className={styles['cancel-drawer__close-btn']} onClick={onClose}>
                    <X size={18} />
                </button>

                <header className={styles['cancel-drawer__header']}>
                    <h2 className={styles['cancel-drawer__title']}>Cancelación de envío</h2>
                    <p className={styles['cancel-drawer__subtitle']}>
                        Confirma la información del envío y selecciona el motivo para solicitar la cancelación.
                    </p>
                </header>

                <div className={styles['cancel-drawer__body']}>

                    <div className={styles['shipment-info-card']}>
                        <div className={styles['shipment-info-card__section']}>
                            <label className={styles['shipment-info-card__label']}>Paquetería:</label>
                            <div className={styles['shipment-info-card__carrier']}>
                                <img src={shipmentData.quoteSelected.logoUrl} alt="Carrier" />
                                <div className={styles['shipment-info-card__carrier-details']}>
                                    <span className={styles['shipment-info-card__carrier-name']}>
                                        {shipmentData.quoteSelected.carrierCode}
                                    </span>
                                    <div className={styles['shipment-info-card__tracking-row']}>
                                        <span className={styles['shipment-info-card__tracking-number']}>
                                            {shipmentData.trackingProvisional}
                                        </span>
                                        <button
                                            className={`
                                                ${styles['shipment-info-card__copy-btn']} 
                                                ${isCopied ? styles['shipment-info-card__copy-btn--success'] : ''}
                                            `}
                                            onClick={() => handleCopy(shipmentData.trackingProvisional)}
                                            type="button"
                                        >
                                            {isCopied ? (
                                                <Check size={14} className={styles['shipment-info-card__copy-btn__icon-success']} />
                                            ) : (
                                                <Copy size={14} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles['shipment-info-card__section']}>
                            <label className={styles['shipment-info-card__label']}>Destinatario:</label>
                            <div className={styles['shipment-info-card__value-main']}>{shipmentData.destinationAddress.fullName}</div>
                            <div className={styles['shipment-info-card__value-sub']}>{shipmentData.destinationAddress.postalCode} - {shipmentData.destinationAddress.city}</div>
                        </div>

                        <div className={styles['shipment-info-card__section']}>
                            <label className={styles['shipment-info-card__label-creation']}>Creación:</label>
                            <div className={styles['shipment-info-card__value-main-creation']}>
                                Creado el {new Date(shipmentData.createdAt).toLocaleDateString('es-MX')}, {new Date(shipmentData.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </div>
                        </div>
                    </div>

                    <div className={styles['reason-selector']}>
                        <label className={styles['reason-selector__label']}>
                            Selecciona el motivo por el cual deseas cancelar este envío:
                        </label>
                        <div className={styles['reason-selector__list']}>
                            {reasons.map((reason) => (
                                <RadioUi
                                    key={reason.id}
                                    name="cancel-reason"
                                    label={reason.label}
                                    checked={selectedReason === reason.id}
                                    onChange={() => setSelectedReason(reason.id)}
                                    disabled={isSubmitting}
                                />
                            ))}
                        </div>
                        {selectedReason === 'OTHER' && (
                            <div style={{ marginTop: '0.75rem' }}>
                                <TextareaUi
                                    label="Detalles adicionales"
                                    placeholder="Describe brevemente el motivo de la cancelación"
                                    value={otherReasonDetails}
                                    onChange={(e) => setOtherReasonDetails(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles['warning-box']}>
                        <TriangleAlert size={20} className={styles['warning-box__icon']} />
                        <p className={styles['warning-box__text']}>
                            Algunos envíos no pueden cancelarse si ya fueron recolectados o ingresados en sucursal por la paquetería.
                        </p>
                    </div>
                </div>

                <footer className={styles['cancel-drawer__footer']}>
                    <div className={styles['cancel-drawer__footer-actions']}>
                        <ButtonUi variant="light" className={styles['cancel-drawer__btn-cancel']} onClick={onClose}>
                            Volver
                        </ButtonUi>
                        <ButtonUi
                            variant="primary"
                            className={styles['cancel-drawer__btn']}
                            disabled={!selectedReason || isSubmitting}
                            onClick={onSubmit}
                        >
                            {isSubmitting ? 'Procesando...' : 'Solicitar cancelación'}
                        </ButtonUi>
                    </div>
                </footer>
            </div>
        </Drawer>
    );
};