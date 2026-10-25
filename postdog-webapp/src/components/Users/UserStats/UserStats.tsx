import React from 'react';
import styles from './UserStats.module.scss';
import { UserStats as UserStatsType } from '../../../types';
import { PLANS_COLORS } from './constant';
import { UserStatsSkeleton } from '../../ui/SkeletonUi/UserStatsSkeleton/UserStatsSkeleton';

interface UserStatsProps {
    stats: UserStatsType | null;
    loading?: boolean;
}

export const UserStats: React.FC<UserStatsProps> = ({ stats, loading }) => {

    if (loading) {
        return <UserStatsSkeleton />;
    }

    return (
        <div className={styles['users-stats']}>
            {PLANS_COLORS.map((plan) => (
                <div key={plan.key} className={styles['users-stats__card']}>
                    <p className={styles['users-stats__label']}>{plan.label}</p>
                    <p className={styles['users-stats__value']}>
                        {stats?.[plan.key as keyof UserStatsType] || 0}
                    </p>
                    <p className={styles['users-stats__unit']}>usuarios activos</p>
                </div>
            ))}
        </div>
    );
};