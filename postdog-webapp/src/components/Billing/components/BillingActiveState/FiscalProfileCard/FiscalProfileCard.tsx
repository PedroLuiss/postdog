import React from 'react';
import { Pencil } from 'lucide-react';
import { FileTextIcon } from '../../../icons/BillingIcons';
import { FiscalProfileCardProps } from '../../../Type/Billing.Type';
import styles from './FiscalProfileCard.module.scss';

export const FiscalProfileCard: React.FC<FiscalProfileCardProps> = ({
    formData,
    onEdit
}) => {
    return (
        <div className={styles['info-card']}>
            <div className={styles['header-flex']}>
                <div className={styles['icon-box-minimal']}>
                    <FileTextIcon />
                </div>
                <h3 className={styles['header-title']}>Perfil fiscal</h3>
            </div>

            <div className={styles['items-container']}>
                <div className={styles['item-row']}>
                    <div className={styles['label-rfc']}>RFC</div>
                    <div className={styles['value-rfc']}>{formData.rfc}</div>
                </div>
                <div className={styles['item-row']}>
                    <div className={styles['label-razon']}>Razón social</div>
                    <div className={styles['value-razon']}>{formData.razonSocial}</div>
                </div>
                <div className={styles['item-row']}>
                    <div className={styles['label-cp']}>Código postal</div>
                    <div className={styles['value-cp']}>{formData.codigoPostal}</div>
                </div>
                <div className={styles['item-row']}>
                    <div className={styles['label-uso']}>Uso de CFDI</div>
                    <div className={styles['value-uso']}>{formData.usoCfdi}</div>
                </div>
            </div>

            <button className={styles['btn-outline']} onClick={onEdit}>
                <Pencil size={16} className={styles['icon-spacing']} />
                <span>Editar</span>
            </button>
        </div>
    );
};
