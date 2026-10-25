import React from 'react';
import styles from './DashboardAnalyticsSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const DashboardAnalyticsSkeleton: React.FC = () => {
    return (
        <div className={styles['analytics-skeleton']}>
            
            <section className={styles['analytics-skeleton__card']}>
                <div className={styles['analytics-skeleton__header']}>
                    <SkeletonUi width="150px" height={24} borderRadius="4px" />
                    <div className={styles['analytics-skeleton__selector']}>
                        <SkeletonUi width="32px" height={32} borderRadius="50%" />
                        <SkeletonUi width="40px" height={20} borderRadius="4px" />
                        <SkeletonUi width="32px" height={32} borderRadius="50%" />
                    </div>
                </div>
                <div className={styles['analytics-skeleton__chart']}>
                    <SkeletonUi width="100%" height="100%" borderRadius="8px" />
                </div>
            </section>

            <section className={styles['analytics-skeleton__card']}>
                <div className={styles['analytics-skeleton__header']}>
                    <SkeletonUi width="180px" height={24} borderRadius="4px" />
                </div>
                <div className={styles['analytics-skeleton__chart']}>
                    <SkeletonUi width="100%" height="100%" borderRadius="8px" />
                </div>
            </section>

            <section className={styles['analytics-skeleton__card']}>
                <div className={styles['analytics-skeleton__header']}>
                    <SkeletonUi width="160px" height={24} borderRadius="4px" />
                </div>
                <div className={styles['analytics-skeleton__chart']}>
                    <SkeletonUi width="100%" height="100%" borderRadius="8px" />
                </div>
            </section>

        </div>
    );
};