import React from 'react';
import styles from './UserTableSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const UserCardSkeleton: React.FC = () => {
    return (
        <div className={styles['user-card-skeleton']}>
            <div className={styles['user-card-skeleton__header']}>
                <SkeletonUi width="1.2rem" height="1.2rem" borderRadius="4px" />
                <div className={styles['user-card-skeleton__info']}>
                    <SkeletonUi width="60%" height="1rem" borderRadius="4px" />
                    <SkeletonUi width="80%" height="0.8rem" borderRadius="4px" style={{marginTop: '4px'}} />
                </div>
            </div>
            <div className={styles['user-card-skeleton__grid']}>
                {[...Array(4)].map((_, j) => (
                    <div key={j} className={styles['user-card-skeleton__item']}>
                        <SkeletonUi width="40px" height="0.6rem" borderRadius="2px" />
                        <SkeletonUi width="60px" height="0.9rem" borderRadius="4px" style={{marginTop: '4px'}} />
                    </div>
                ))}
            </div>
            <div className={styles['user-card-skeleton__footer']}>
                <SkeletonUi width="120px" height="0.7rem" borderRadius="4px" />
            </div>
        </div>
    );
};
