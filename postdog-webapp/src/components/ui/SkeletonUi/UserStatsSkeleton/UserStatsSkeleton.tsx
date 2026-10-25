import React from 'react';
import styles from './UserStatsSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const UserStatsSkeleton: React.FC = () => {
    return (
        <div className={styles['users-stats-skeleton']}>
            {[...Array(4)].map((_, i) => (
                <div key={i} className={styles['stats-card-skeleton']}>
                    <div className={styles['stats-card-skeleton__label']}>
                        <SkeletonUi width="60px" height="12px" borderRadius="2px" />
                    </div>
                    
                    <div className={styles['stats-card-skeleton__value']}>
                        <SkeletonUi width="80px" height="32px" borderRadius="4px" />
                    </div>

                    <div className={styles['stats-card-skeleton__unit']}>
                        <SkeletonUi width="100px" height="12px" borderRadius="2px" />
                    </div>
                </div>
            ))}
        </div>
    );
};