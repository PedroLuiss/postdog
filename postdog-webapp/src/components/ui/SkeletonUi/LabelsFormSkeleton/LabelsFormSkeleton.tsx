import React from 'react';
import styles from './LabelsFormSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const LabelsFormSkeleton: React.FC = () => {
  return (
    <div className={styles['skeleton-labels']}>
      <div className={styles['skeleton-labels__container']}>
        
        <div className={styles['skeleton-labels__section']}>
          <SkeletonUi width={80} height={18} borderRadius="4px" className={styles['skeleton-labels__title']} />
          
          <div className={styles['skeleton-labels__group']}>
            <div className={styles['skeleton-labels__item']}>
              <div className={styles['skeleton-labels__row']}>
                <SkeletonUi width={20} height={20} borderRadius="50%" />
                <SkeletonUi width="50%" height={16} />
              </div>
              <div className={styles['skeleton-labels__text-block']}>
                <SkeletonUi width="90%" height={12} />
                <SkeletonUi width="60%" height={12} />
              </div>
            </div>

            <div className={styles['skeleton-labels__item']}>
              <div className={styles['skeleton-labels__row']}>
                <SkeletonUi width={20} height={20} borderRadius="50%" />
                <SkeletonUi width="45%" height={16} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles['skeleton-labels__divider']} />

        <div className={styles['skeleton-labels__section']}>
          <SkeletonUi width={140} height={18} borderRadius="4px" className={styles['skeleton-labels__title']} />
          
          <div className={styles['skeleton-labels__item']}>
            <div className={styles['skeleton-labels__row']}>
              <SkeletonUi width={36} height={20} borderRadius="10px" />
              <SkeletonUi width="65%" height={16} />
            </div>
            <div className={styles['skeleton-labels__text-block-alt']}>
              <SkeletonUi width="40%" height={12} />
            </div>
          </div>
        </div>

        <div className={styles['skeleton-labels__footer']}>
          <SkeletonUi width={100} height={36} borderRadius="6px" />
        </div>

      </div>
    </div>
  );
};