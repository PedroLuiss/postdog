import React from 'react';
import styles from './CardStatusNoticeUi.module.scss';

interface CardStatusNoticeUiProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    actions?: React.ReactNode;
}

const CardStatusNoticeUi: React.FC<CardStatusNoticeUiProps> = ({ 
    icon, 
    title, 
    description, 
    actions 
}) => {
    return (
        <div className={styles['status-card']}>
            <div className={styles['status-card__icon-circle']}>
                {icon}
            </div>
            <div className={styles['status-card__text-group']}>
                <h3 className={styles['status-card__title']}>{title}</h3>
                <p className={styles['status-card__description']}>{description}</p>
            </div>
            {actions && (
                <div className={styles['status-card__actions']}>
                    {actions}
                </div>
            )}
        </div>
    );
};

export default CardStatusNoticeUi;