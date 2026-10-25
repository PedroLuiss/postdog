import React from 'react';
import styles from './GlobalAlertsTableRowSkeleton.module.scss';
import { SkeletonUi } from '../../SkeletonUi';

export const GlobalAlertsTableRowSkeleton: React.FC = () => {
  return (
    <tr className={styles['alert-row-skeleton']} >
      <td className={styles['alert-row-skeleton__td']}>
        <SkeletonUi width={36} height={20} borderRadius="10px" />
      </td>

      <td className={styles['alert-row-skeleton__td']}>
        <SkeletonUi width="80%" height={16} borderRadius="4px" />
      </td>

      <td className={styles['alert-row-skeleton__td']}>
        <SkeletonUi width="90%" height={16} borderRadius="4px" />
      </td>

      <td className={styles['alert-row-skeleton__td']}>
        <div className={styles['alert-row-skeleton__date-group']}>
          <SkeletonUi width={16} height={16} borderRadius="4px" />
          <SkeletonUi width="120px" height={14} borderRadius="4px" />
        </div>
      </td>

      <td className={`${styles['alert-row-skeleton__td']} ${styles['alert-row-skeleton__td--right']}`}>
        <SkeletonUi width={32} height={32} borderRadius="6px" />
      </td>
    </tr>
  );
};