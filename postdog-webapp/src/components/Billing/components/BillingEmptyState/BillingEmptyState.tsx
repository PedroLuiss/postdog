import React from 'react';
import { BillingMainIcon, SecondaryIcon } from '../../icons/BillingIcons';
import { BillingEmptyStateProps } from '../../Type/Billing.Type';
import styles from './BillingEmptyState.module.scss';

export const BillingEmptyState: React.FC<BillingEmptyStateProps> = ({
    title,
    description,
    buttonText,
    onButtonClick
}) => {
    return (
        <div className={styles['card-empty-state']}>
            <div className={styles['card-empty-state__inner']}>
                <div className={styles['card-empty-state__icon-container']}>
                    <BillingMainIcon className="text-white" />
                    <div className={styles['badge-icon']}>
                        <SecondaryIcon />
                    </div>
                </div>

                <div className={styles['card-empty-state__info']}>
                    <h2 className={styles['title']}>{title}</h2>
                    <p className={styles['description']}>{description}</p>
                </div>

                <button
                    className={styles['btn-billing-action']}
                    onClick={onButtonClick}
                >
                    <span>{buttonText}</span>
                </button>
            </div>
        </div>
    );
};
