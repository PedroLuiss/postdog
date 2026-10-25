import React from 'react';
import styles from './PackagingItemSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

const PackagingItemSkeleton: React.FC = () => {
    return (
        <div className={styles['skeleton-card']}>
            <div className={styles['skeleton-card__header']}>
                <SkeletonUi width={48} height={48} borderRadius="8px" />
                <div className={styles['skeleton-card__info']}>
                    <SkeletonUi width="60%" height={16} />
                    <SkeletonUi width="40%" height={12} />
                </div>
            </div>
            
            <div className={styles['skeleton-card__details']}>
                <div className={styles['skeleton-card__column']}>
                    <SkeletonUi width="50%" height={10} />
                    <SkeletonUi width="80%" height={10} />
                </div>
                <div className={styles['skeleton-card__price']}>
                    <SkeletonUi width={60} height={20} />
                </div>
            </div>

            <div className={styles['skeleton-card__footer']}>
                <SkeletonUi width={80} height={24} borderRadius="12px" />
                <SkeletonUi width={80} height={24} borderRadius="12px" />
                <SkeletonUi width={80} height={24} borderRadius="12px" />
            </div>
        </div>
    );
};

export default PackagingItemSkeleton;