import React from 'react';
import styles from './NotificationItemSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const NotificationItemSkeleton: React.FC = () => {
  return (
    <div className={styles['notification-skeleton']}>
      <div className={styles['notification-skeleton__icon-container']}>
        <SkeletonUi width="3rem" height="3rem" borderRadius="50%" className={styles['notification-skeleton__icon']} />
      </div>

      <div className={styles['notification-skeleton__content']}>
        <div className={styles['notification-skeleton__top']}>
          <SkeletonUi width="40%" height="1.2rem" borderRadius="4px" />
          <SkeletonUi width="60px" height="0.8rem" borderRadius="4px" className={styles['notification-skeleton__time']} />
        </div>

        <div className={styles['notification-skeleton__bottom']}>
          <div className={styles['notification-skeleton__body-wrapper']}>
            <SkeletonUi width="90%" height="0.9rem" borderRadius="4px" />
            <SkeletonUi width="60%" height="0.9rem" borderRadius="4px" />
          </div>
        </div>
      </div>
    </div>
  );
};