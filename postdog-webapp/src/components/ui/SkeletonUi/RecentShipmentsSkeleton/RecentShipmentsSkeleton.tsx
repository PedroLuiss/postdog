import React from 'react';
import styles from './RecentShipmentsSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const RecentShipmentsSkeleton: React.FC = () => {
    return (
        <section className={styles['recent-shipments-skeleton']}>
            <div className={styles['recent-shipments-skeleton__header']}>
                <SkeletonUi width="120px" height={22} borderRadius="4px" />
                <SkeletonUi width="80px" height={16} borderRadius="4px" />
            </div>

            <div className={styles['recent-shipments-skeleton__list']}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={styles['recent-shipment-item-skeleton']}>
                        <div className={styles['recent-shipment-item-skeleton__info']}>
                            <SkeletonUi width="1.5rem" height="1.5rem" borderRadius="4px" />
                            
                            <div className={styles['recent-shipment-item-skeleton__details']}>
                                <SkeletonUi width="100px" height={16} borderRadius="4px" />
                                <SkeletonUi width="140px" height={12} borderRadius="4px" />
                            </div>
                        </div>

                        <div className={styles['recent-shipment-item-skeleton__status']}>
                            <SkeletonUi width="85px" height={24} borderRadius="6px" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};