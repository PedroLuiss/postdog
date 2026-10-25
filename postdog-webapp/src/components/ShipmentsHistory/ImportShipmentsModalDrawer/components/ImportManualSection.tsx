import React, { useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import styles from '../ImportShipmentsDrawer.module.scss';
import SelectUi from '../../../ui/SelectUi/SelectUi';
import ButtonUi from '../../../ui/Button/ButtonUi';
import InputUi from '../../../ui/Input/InputUi';
import { ManualShipment, useImportManual } from './hooks/useImportManual';

interface ImportManualSectionProps {
    carrierOptions: { label: string, value: string | number }[];
    onImport: (data: ManualShipment[]) => void;
    isLoading?: boolean;
}

const ImportManualSection: React.FC<ImportManualSectionProps> = ({ carrierOptions, onImport, isLoading }) => {
    const { 
        shipments, 
        addShipment, 
        removeShipment, 
        updateShipment, 
        isReadyToImport 
    } = useImportManual();

    const handleConfirm = useCallback(() => {
        onImport(shipments);
    }, [onImport, shipments]);

    return (
        <section className={styles['import-card']}>
            <div className={styles['import-card__header-text']}>
                <p className={styles['import-card__main-text']}>
                    Visualiza y controla cada envío en Postdog. Incluye también los que generas en otras plataformas.
                </p>
                <p className={styles['import-card__sub-text']}>
                    Ingresa la información para importar un envío.
                </p>
            </div>

            <div className={styles['import-card__form-list']}>
                {shipments.map((shipment, index) => (
                    <div key={shipment.id} className={styles['import-card__form-item']}>
                        {shipments.length > 1 && (
                            <button 
                                className={styles['import-card__remove-btn']}
                                onClick={() => removeShipment(shipment.id)}
                                type="button"
                            >
                                <X size={16} />
                            </button>
                        )}

                        <div className={styles['import-card__grid']}>
                            <SelectUi 
                                label={
                                    <>
                                        Paquetería
                                        <span className={styles['import-card__required-field']}>*</span>
                                    </>
                                }
                                placeholder="Elige una opción"
                                containerClassName={styles['import-card__carrier-select']}
                                options={carrierOptions}
                                value={shipment.carrier}
                                onChange={(e) => updateShipment(shipment.id, 'carrier', e.target.value)}
                            />
                            <InputUi
                                 containerClassName={styles['import-card__carrier-select']}
                                label={
                                    <>
                                        Número de rastreo
                                        <span className={styles['import-card__required-field']}>*</span>
                                    </>
                                }
                                placeholder="Escribe el número de rastreo"
                                value={shipment.tracking}
                                onChange={(e) => updateShipment(shipment.id, 'tracking', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles['import-card__footer-actions']}>
                <ButtonUi
                    variant="light"
                    icon={<Plus size={16} />}
                    className={styles['import-card__add-btn']}
                    onClick={addShipment}
                >
                    Añadir envío
                </ButtonUi>

                <ButtonUi
                    variant="primary"
                    className={styles['import-card__submit-import-shipments']}
                    fullWidth
                    disabled={!isReadyToImport}
                    onClick={handleConfirm}
                    isLoading={isLoading}
                >
                    Importar envíos
                </ButtonUi>
            </div>
        </section>
    );
};

export default ImportManualSection;