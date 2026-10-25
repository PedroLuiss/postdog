import React from 'react';
import { Truck, MapPinned, Printer } from 'lucide-react';
import styles from './PackagingItem.module.scss';

interface PackagingItemProps {
    packaging: any;
    isSelected?: boolean;
    onSelect?: () => void;
}

const PackagingItem: React.FC<PackagingItemProps> = ({ packaging, isSelected, onSelect }) => (
    <div
        className={`${styles['packaging-card']} ${isSelected ? styles['packaging-card--selected'] : ''}`}
        onClick={(e) => {
            e.preventDefault();
            if (onSelect) onSelect();
        }}
    >
        <div className={styles['packaging-card__body']}>
            <div className={styles['packaging-card__header']}>
                <img src={packaging.logo} alt={packaging.name} className={styles['packaging-card__logo']} />
                <div className={styles['packaging-card__info']}>
                    <h4 className={styles['packaging-card__name']}>{packaging.name}</h4>
                    <p className={styles['packaging-card__estimate']}>Entrega estimada: {packaging.estimate}</p>
                </div>
            </div>

            <div className={styles['packaging-card__details']}>
                <div className={styles['packaging-card__delivery']}>
                    <p className={styles['packaging-card__label-xs']}>Opciones de entrega</p>
                    <p className={styles['packaging-card__text-xs']}>• Entrega directa en sucursal</p>
                    <p className={styles['packaging-card__text-xs']}>
                        • Servicio de recolección:
                        <span className={packaging.pickup ? styles['text-success'] : styles['text-error']}>
                            {packaging.pickup ? ' Disponible' : ' No disponible'}
                        </span>
                    </p>
                </div>
                <div className={styles['packaging-card__price-box']}>
                    <p className={styles['packaging-card__label-xs']}>Precio</p>
                    <p className={styles['packaging-card__amount']}>${packaging.price.toFixed(2)}</p>
                </div>
            </div>

            <div className={styles['packaging-card__features']}>
                <p className={styles['packaging-card__features-title']}>Características</p>
                <div className={styles['packaging-card__features-list']}>
                    <div className={styles['packaging-card__feature-item']}>
                        <div className={`${styles['packaging-card__feature-badge']} ${!packaging.pickupAvailable ? styles['packaging-card__feature-badge--disabled'] : ''}`}>
                            <Truck size={14} />
                        </div>
                        <span className={styles['packaging-card__feature-text']}>Recolección</span>
                    </div>
                    <div className={styles['packaging-card__feature-item']}>
                        <div className={`${styles['packaging-card__feature-badge']} ${!packaging.trackingAvailable ? styles['packaging-card__feature-badge--disabled'] : ''}`}>
                            <MapPinned size={14} />
                        </div>
                        <span className={styles['packaging-card__feature-text']}>Rastreo</span>
                    </div>
                    <div className={styles['packaging-card__feature-item']}>
                        <div className={`${styles['packaging-card__feature-badge']} ${!packaging.thermalPrintingAvailable ? styles['packaging-card__feature-badge--disabled'] : ''}`}>
                            <Printer size={14} />
                        </div>
                        <span className={styles['packaging-card__feature-text']}>Impresión térmica</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default PackagingItem;