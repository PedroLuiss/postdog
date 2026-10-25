import React from 'react';
import styles from './PackageCardSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const PackageCardSkeleton: React.FC = () => {
  return (
    <div className={styles['package-skeleton']}>
      <div className={styles['package-skeleton__container']}>
        <div className={styles['package-skeleton__layout']}>
          
          <div className={styles['package-skeleton__content']}>
            <div className={styles['package-skeleton__header']}>
              <SkeletonUi width={20} height={20} borderRadius="4px" />
              <SkeletonUi width="35%" height={22} borderRadius="4px" />
            </div>
            
            <div className={styles['package-skeleton__details']}>
              <div className={styles['package-skeleton__row']}>
                <SkeletonUi width={16} height={16} borderRadius="2px" />
                <SkeletonUi width="80px" height={16} borderRadius="2px" />
                <div className={styles['package-skeleton__dot']} />
                <SkeletonUi width={16} height={16} borderRadius="2px" />
                <SkeletonUi width="60px" height={16} borderRadius="2px" />
              </div>
              
              <div className={styles['package-skeleton__row']}>
                <SkeletonUi width={16} height={16} borderRadius="2px" />
                <SkeletonUi width="50%" height={16} borderRadius="2px" />
              </div>
            </div>
          </div>

          <div className={styles['package-skeleton__actions']}>
            <SkeletonUi width={36} height={36} borderRadius="6px" />
            <SkeletonUi width={36} height={36} borderRadius="6px" />
            <SkeletonUi width={36} height={36} borderRadius="6px" />
          </div>

        </div>
      </div>
    </div>
  );
};