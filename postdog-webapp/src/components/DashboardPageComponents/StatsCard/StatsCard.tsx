import React from 'react';
import styles from './StatsCard.module.scss';

interface StatsCardProps {
    label: string;
    value: string | number;
    subtitle: string;
    icon: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, subtitle, icon }) => {
    return (
        <div className={styles['stats-card']}>
            <div className={styles['stats-card__header']}>
                <h3 className={styles['stats-card__label']}>{label}</h3>
                <div className={styles['stats-card__icon']}>
                    {typeof icon === 'function' ? React.createElement(icon) : icon}
                </div>
            </div>
            <p className={styles['stats-card__value']}>{value}</p>
            <p className={styles['stats-card__subtitle']}>{subtitle}</p>
        </div>
    );
};

export default StatsCard;