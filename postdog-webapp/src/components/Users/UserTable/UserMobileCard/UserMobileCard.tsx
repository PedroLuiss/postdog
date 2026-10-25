import React, { useCallback } from 'react';
import styles from '../UserTable.module.scss';
import { formatDateNotificationGlobal } from '../../../../utils';
import type { UserMobileCardProps } from './types';
import { UserTableOptions } from '../UserTableRow/UserTableOptions/UserTableOptions';

export const UserMobileCard: React.FC<UserMobileCardProps> = React.memo(({
    user, isSelected, onToggleSelect, onAction, isVendor
}) => {
    const handleToggle = useCallback(() => {
        onToggleSelect(user.uid);
    }, [onToggleSelect, user.uid]);

    return (
        <div className={`${styles['user-card']} ${user.status?.name !== 'ACTIVE' ? styles['user-card--inactive'] : ''}`}>
            <div className={styles['user-card__header']}>
                <div className={styles['user-card__checkbox-wrapper']}>
                    <input 
                        type="checkbox" 
                        className={styles['users-table-card__checkbox']} 
                        checked={isSelected}
                        onChange={handleToggle}
                    />
                </div>
                <div className={styles['user-card__info']}>
                    <div className={styles['user-card__name']}>{user.firstName} {user.lastName}</div>
                    <div className={styles['user-card__email']}>{user.email}</div>
                </div>
                <div className={styles['user-card__actions']}>
                    <UserTableOptions 
                        user={user} 
                        onAction={onAction} 
                        isVendor={isVendor} 
                        isInactive={user.status?.name !== 'ACTIVE'}
                    />
                </div>
            </div>
            <div className={styles['user-card__grid']}>
                <div className={styles['user-card__item']}>
                    <span className={styles['user-card__label']}>Plan:</span>
                    <span className={styles['user-card__value']} style={{ textTransform: 'capitalize' }}>{user.plan}</span>
                </div>
                <div className={styles['user-card__item']}>
                    <span className={styles['user-card__label']}>Rol:</span>
                    <span className={styles['user-card__value']} style={{ textTransform: 'capitalize' }}>{user.role}</span>
                </div>
                <div className={styles['user-card__item']}>
                    <span className={styles['user-card__label']}>Verificado:</span>
                    <span className={user.isVerified ? styles['users-table-card__td--verified'] : styles['users-table-card__td--unverified']}>
                        {user.isVerified ? 'Sí' : 'No'}
                    </span>
                </div>
                <div className={styles['user-card__item']}>
                    <span className={styles['user-card__label']}>WhatsApp:</span>
                    <a href={`https://wa.me/${user.phone}`} target="_blank" rel="noreferrer" className={styles['user-card__link']}>
                        {user.phone}
                    </a>
                </div>
            </div>
            <div className={styles['user-card__footer']}>
                <div className={styles['user-card__date']}>
                    <span>Registro: {formatDateNotificationGlobal(user.createdAt)}</span>
                </div>
            </div>
        </div>
    );
});

UserMobileCard.displayName = 'UserMobileCard';

