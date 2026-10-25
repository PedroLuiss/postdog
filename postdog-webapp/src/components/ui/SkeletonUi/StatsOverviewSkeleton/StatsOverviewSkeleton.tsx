import React from 'react';
import styles from './StatsOverviewSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const StatsOverviewSkeleton: React.FC<{className?: string, count?: number}> = ({className, count = 4}) => {
    return (
        <div className={`${styles['stats-overview-skeleton']} ${className}`}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className={styles['stats-card-skeleton']}>
                    <div className={styles['stats-card-skeleton__header']}>
                        <SkeletonUi width="100px" height={18} borderRadius="4px" />
                        <SkeletonUi width="20px" height={20} borderRadius="50%" />
                    </div>
                    
                    <div className={styles['stats-card-skeleton__value']}>
                        <SkeletonUi width="140px" height={32} borderRadius="4px" />
                    </div>

                    <div className={styles['stats-card-skeleton__subtitle']}>
                        <SkeletonUi width="180px" height={14} borderRadius="4px" />
                    </div>
                </div>
            ))}
        </div>
    );
};