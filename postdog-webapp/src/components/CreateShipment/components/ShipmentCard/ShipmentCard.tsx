import React, { ReactNode } from 'react';
import { Eraser, ChevronUp, SquarePen } from 'lucide-react';
import styles from './ShipmentCard.module.scss';

interface ShipmentCardProps {
    icon: ReactNode;
    title: string;
    isEditing?: boolean;
    onToggleEdit?: () => void;
    onClear?: () => void;
    children: ReactNode;
    showActions?: boolean;
    className?: string;
}

const ShipmentCard: React.FC<ShipmentCardProps> = ({
    icon,
    title,
    isEditing = false,
    onToggleEdit,
    onClear,
    children,
    showActions = true,
    className = '',
}) => {
    return (
        <section className={`${styles['shipment-card']} ${className}`}>
            <div className={styles['shipment-card__header']}>
                <div className={styles['shipment-card__title-wrapper']}>
                    {icon}
                    <h3 className={styles['shipment-card__title']}>{title}</h3>
                </div>
                {showActions && (
                    <div className={styles['shipment-card__actions']}>
                        {isEditing ? (
                            <>
                                {onClear && (
                                    <button 
                                        className={styles['shipment-card__action-btn']} 
                                        title="Limpiar formulario"
                                        onClick={onClear}
                                    >
                                        <Eraser />
                                    </button>
                                )}
                                {onToggleEdit && (
                                    <button 
                                        className={styles['shipment-card__action-btn']}
                                        onClick={onToggleEdit}
                                    >
                                        <ChevronUp />
                                    </button>
                                )}
                            </>
                        ) : (
                            onToggleEdit && (
                                <button 
                                    className={styles['shipment-card__action-btn']}
                                    onClick={onToggleEdit}
                                >
                                    <SquarePen />
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
            
            <div className={styles['shipment-card__body']}>
                {children}
            </div>
        </section>
    );
};

export default ShipmentCard;
