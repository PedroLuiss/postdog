import React from 'react';
import styles from './UserTableSkeleton.module.scss';
import { SkeletonUi } from '../SkeletonUi';

export const UserTableSkeleton: React.FC = () => {
    return (
        <div className={styles['user-table-skeleton']}>
            <div className={styles['user-table-skeleton__desktop']}>
                <table className={styles['user-table-skeleton__table']}>
                    <thead>
                        <tr>
                            {[...Array(10)].map((_, i) => (
                                <th key={i} className={styles['user-table-skeleton__th']}>
                                    <SkeletonUi width="80%" height="1rem" borderRadius="4px" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(6)].map((_, i) => (
                            <tr key={i} className={styles['user-table-skeleton__tr']}>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="1.2rem" height="1.2rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="120px" height="0.9rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="150px" height="0.9rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="100px" height="0.9rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="60px" height="1.5rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="70px" height="0.9rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="70px" height="0.9rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="100px" height="0.9rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="100px" height="0.9rem" borderRadius="4px" /></td>
                                <td className={styles['user-table-skeleton__td']}><SkeletonUi width="20px" height="20px" borderRadius="50%" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles['user-table-skeleton__mobile']}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className={styles['user-card-skeleton']}>
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
                ))}
            </div>
        </div>
    );
};