import React from 'react';
import { Clock } from 'lucide-react';
import SwitchUi from '../../../../ui/SwitchUi/SwitchUi';
import { AutoBillingCardProps } from '../../../Type/Billing.Type';
import styles from './AutoBillingCard.module.scss';

export const AutoBillingCard: React.FC<AutoBillingCardProps> = ({
    isActive,
    onToggle
}) => {

    return (
        <div className={styles['info-card']}>
            <div className={styles['header-flex']}>
                <div className={styles['icon-box-auto']}>
                    <Clock size={20} />
                </div>
                <span className={styles['header-title']}>Facturación automática</span>
                <SwitchUi
                    checked={isActive}
                    onChange={onToggle}
                    className={styles['billing-switch']}
                />
            </div>

            <p className={styles['card-description-text']}>
                {isActive
                    ? "La facturación automática está activa. Se generará una factura por cada recarga que realices o una factura a final del mes según tu elección."
                    : "Activa la facturación automática para facturar todas tus recargas en una sola factura a final del mes o generar una factura por cada recarga realizada."
                }
            </p>
        </div>
    );
};
