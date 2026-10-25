import React from 'react';
import styles from './AddressItemSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const AddressItemSkeleton: React.FC = () => {
    return (
        <div className={styles['address-item-skeleton']}>
            <div className={styles['address-item-skeleton__first-line']}>
                <SkeletonUi width="40%" height={16} borderRadius="4px" />
                <SkeletonUi width={50} height={16} borderRadius="4px" />
            </div>
            <div className={styles['address-item-skeleton__details']}>
                <SkeletonUi width="85%" height={12} borderRadius="3px" />
            </div>
        </div>
    );
};