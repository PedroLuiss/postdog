import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './SelectedPackagingCard.module.scss';

interface SelectedPackagingCardProps {
    packaging: any;
    onOpenList: () => void;
}

const SelectedPackagingCard: React.FC<SelectedPackagingCardProps> = ({ packaging, onOpenList }) => {
    return (
        <div className={styles['selected-card']}>
            <button className={styles['selected-card__button']} onClick={onOpenList}>
                <div className={styles['selected-card__content']}>
                    <img 
                        src={packaging.logo} 
                        alt={packaging.name} 
                        className={styles['selected-card__logo']} 
                    />
                    
                    <div className={styles['selected-card__info']}>
                        <h3 className={styles['selected-card__name']}>{packaging.name}</h3>
                        <p className={styles['selected-card__estimate']}>
                            Entrega estimada: {packaging.estimate.replace('días hábiles', 'días')}
                        </p>
                    </div>

                    <div className={styles['selected-card__actions']}>
                        <div className={styles['selected-card__price-wrapper']}>
                            <span className={styles['selected-card__price-value']}>
                                ${packaging.price.toFixed(2)}
                            </span>
                            <span className={styles['selected-card__price-currency']}>
                                MXN
                            </span>
                        </div>
                        <ChevronDown size={20} className={styles['selected-card__chevron']} />
                    </div>
                </div>
            </button>
        </div>
    );
};

export default SelectedPackagingCard;