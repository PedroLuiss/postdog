import React from 'react';
import styles from './BillingDetailsSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const BillingDetailsSkeleton: React.FC = () => {
    return (
        <div className={styles['billing-skeleton']}>
            {[...Array(7)].map((_, i) => (
                <div key={i} className={styles['field-skeleton']}>
                    <div className={styles['field-skeleton__label']}>
                        <SkeletonUi width="100px" height="12px" borderRadius="4px" />
                    </div>
                    <div className={styles['field-skeleton__value']}>
                        <SkeletonUi width="100%" height="36px" borderRadius="6px" />
                    </div>
                </div>
            ))}

            <div className={styles['billing-skeleton__divider']} />

            <div className={styles['billing-skeleton__auto-invoice']}>
                <SkeletonUi width="180px" height="14px" borderRadius="4px" />
                <SkeletonUi width="140px" height="14px" borderRadius="4px" style={{ marginTop: '8px' }} />
            </div>

            <div className={styles['billing-skeleton__note']}>
                <SkeletonUi width="100%" height="40px" borderRadius="8px" />
            </div>
        </div>
    );
};