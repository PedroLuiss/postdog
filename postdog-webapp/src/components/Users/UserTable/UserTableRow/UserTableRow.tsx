import React, { useCallback, useMemo } from 'react';
import { Check, X } from 'lucide-react';
import styles from '../UserTable.module.scss';
import { formatDateNotificationGlobal } from '../../../../utils';
import type { UserTableRowProps } from './types';
import { UserTableOptions } from './UserTableOptions/UserTableOptions';

export const UserTableRow = React.memo<UserTableRowProps>(({ 
    user, isSelected, onToggleSelect, onAction, isVendor, onlyOptions = false
}) => {
    const isInactive = useMemo(() => user.status?.name !== 'ACTIVE', [user.status?.name]);

    const handleToggle = useCallback(() => {
        onToggleSelect(user.uid);
    }, [onToggleSelect, user.uid]);

    const options = (
        <UserTableOptions 
            user={user}
            isInactive={isInactive}
            isVendor={isVendor}
            onAction={onAction}
        />
    );

    if (onlyOptions) return options;

    return (
        <tr className={`${styles['users-table-card__tr']} ${isInactive ? styles['users-table-card__tr--inactive'] : ''}`}>
            <td className={styles['users-table-card__td--check']}>
                <input 
                    type="checkbox" 
                    className={styles['users-table-card__checkbox']} 
                    checked={isSelected}
                    onChange={handleToggle}
                    disabled={isVendor}
                />
            </td>
            <td className={styles['users-table-card__td--name']}>
                {user.firstName} {user.lastName}
            </td>
            <td className={styles['users-table-card__td']}>
                {user.email}
            </td>
            <td className={`${styles['users-table-card__td']} ${styles['users-table-card__td--phone']}`}>
                <a href={`https://wa.me/${user.phone}`} target="_blank" rel="noreferrer">
                    {user.phone}
                </a>
            </td>
            <td className={styles['users-table-card__td']}>
                {user.isVerified ? (
                    <span className={styles['users-table-card__td--verified']}>
                        <Check /> Sí
                    </span>
                ) : (
                    <span className={styles['users-table-card__td--unverified']}>
                        <X /> No
                    </span>
                )}
            </td>
            <td className={styles['users-table-card__td']}>
                <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
            </td>
            <td className={styles['users-table-card__td']}>
                <span style={{ textTransform: 'capitalize' }}>{user.plan}</span>
            </td>
            <td className={styles['users-table-card__td']}>
                {user.lastShipmentDate ? formatDateNotificationGlobal(user.lastShipmentDate) : 'Sin envíos'}
            </td>
            <td className={styles['users-table-card__td']}>
                {formatDateNotificationGlobal(user.createdAt)}
            </td>
            <td className={styles['users-table-card__td']}>
                {options}
            </td>
        </tr>
    );
});

UserTableRow.displayName = 'UserTableRow';

