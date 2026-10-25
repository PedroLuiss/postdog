import React from 'react';
import styles from './UserTableRowSkeleton.module.scss';
import { SkeletonUi } from '../../../ui/SkeletonUi/SkeletonUi';

export const UserTableRowSkeleton = React.forwardRef<HTMLTableRowElement>((_, ref) => {
    return (
        
        <tr className={styles['users-table-card__tr']} ref={ref}>
            <td className={styles['users-table-card__td--check']}>
                <SkeletonUi width="1.2rem" height="1.2rem" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td--name']}>
                <SkeletonUi width="140px" height="14px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="180px" height="14px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="100px" height="14px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="60px" height="24px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="70px" height="14px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="70px" height="14px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="100px" height="14px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="100px" height="14px" borderRadius="4px" />
            </td>
            
            <td className={styles['users-table-card__td']}>
                <SkeletonUi width="18px" height="18px" borderRadius="50%" />
            </td>
        </tr>
    );
});

UserTableRowSkeleton.displayName = 'UserTableRowSkeleton';