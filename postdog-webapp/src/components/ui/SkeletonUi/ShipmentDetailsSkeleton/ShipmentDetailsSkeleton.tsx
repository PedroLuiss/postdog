import React from 'react';
import styles from './ShipmentDetailsSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const ShipmentDetailsSkeleton: React.FC = () => {
    return (
        <div className={styles['details-skeleton']}>
            <div className={styles['details-skeleton__header']}>
                <SkeletonUi width={40} height={40} borderRadius="8px" />
                <div className={styles['details-skeleton__header-info']}>
                    <SkeletonUi width="150px" height={20} borderRadius="4px" />
                    <SkeletonUi width="200px" height={14} borderRadius="4px" />
                </div>
            </div>

            <div className={styles['details-skeleton__body']}>
                <div className={styles['details-skeleton__card']}>
                    <div className={styles['details-skeleton__section']}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles['details-skeleton__row']}>
                                <SkeletonUi width="100px" height={14} borderRadius="4px" />
                                <SkeletonUi width="120px" height={14} borderRadius="4px" />
                            </div>
                        ))}
                        <div className={styles['details-skeleton__divider']} />
                        <div className={styles['details-skeleton__row']}>
                            <SkeletonUi width="80px" height={18} borderRadius="4px" />
                            <SkeletonUi width="100px" height={22} borderRadius="4px" />
                        </div>
                    </div>
                    <div className={styles['details-skeleton__tracker']}>
                        <SkeletonUi width="140px" height={16} borderRadius="4px" />
                        <SkeletonUi width="180px" height={12} borderRadius="4px" />
                        <SkeletonUi width="100px" height={24} borderRadius="12px" />
                        <SkeletonUi width="120px" height={14} borderRadius="4px" />
                    </div>
                </div>

                <div className={styles['details-skeleton__card']}>
                    <div className={styles['details-skeleton__grid']}>
                        {[1, 2].map((block) => (
                            <div key={block} className={styles['details-skeleton__address-block']}>
                                <div className={styles['details-skeleton__address-header']}>
                                    <SkeletonUi width={16} height={16} borderRadius="50%" />
                                    <SkeletonUi width="80px" height={16} borderRadius="4px" />
                                </div>
                                <div className={styles['details-skeleton__address-content']}>
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className={styles['details-skeleton__address-row']}>
                                            <SkeletonUi width="60px" height={12} borderRadius="4px" />
                                            <SkeletonUi width="70%" height={12} borderRadius="4px" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles['details-skeleton__card']}>
                    <div className={styles['details-skeleton__package-header']}>
                        <SkeletonUi width={16} height={16} borderRadius="4px" />
                        <SkeletonUi width="120px" height={16} borderRadius="4px" />
                    </div>
                    <div className={styles['details-skeleton__package-body']}>
                        <SkeletonUi width="80%" height={14} borderRadius="4px" />
                        <SkeletonUi width="40%" height={14} borderRadius="4px" />
                        <SkeletonUi width="60%" height={14} borderRadius="4px" />
                    </div>
                </div>
            </div>
        </div>
    );
};