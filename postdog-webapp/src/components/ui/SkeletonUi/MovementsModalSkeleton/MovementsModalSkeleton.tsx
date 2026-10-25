import React from 'react';
import styles from './MovementsModalSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const MovementsModalSkeleton: React.FC = () => {
    return (
        <div className={styles['movements-skeleton']}>
            <div className={styles['movements-skeleton__stats-grid']}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className={styles['stat-box-skeleton']}>
                        <SkeletonUi width="80px" height="12px" borderRadius="4px" />
                        <SkeletonUi width="120px" height="24px" borderRadius="4px" style={{ marginTop: '8px' }} />
                    </div>
                ))}
                <div className={`${styles['stat-box-skeleton']} ${styles['stat-box-skeleton--full']}`}>
                    <SkeletonUi width="80px" height="12px" borderRadius="4px" />
                    <SkeletonUi width="200px" height="24px" borderRadius="4px" style={{ marginTop: '8px' }} />
                </div>
            </div>

            <div className={styles['movements-skeleton__history']}>
                <div className={styles['movements-skeleton__history-title']}>
                    <SkeletonUi width="140px" height="16px" borderRadius="4px" />
                </div>

                <div className={styles['movements-skeleton__list']}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={styles['movement-item-skeleton']}>
                            <div className={styles['movement-item-skeleton__left']}>
                                <SkeletonUi width="40px" height="40px" borderRadius="10px" />
                                <div className={styles['movement-item-skeleton__info']}>
                                    <SkeletonUi width="150px" height="14px" borderRadius="4px" />
                                    <SkeletonUi width="100px" height="12px" borderRadius="4px" style={{ marginTop: '6px' }} />
                                </div>
                            </div>
                            <div className={styles['movement-item-skeleton__right']}>
                                <SkeletonUi width="80px" height="15px" borderRadius="4px" />
                                <SkeletonUi width="50px" height="11px" borderRadius="4px" style={{ marginTop: '6px' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};