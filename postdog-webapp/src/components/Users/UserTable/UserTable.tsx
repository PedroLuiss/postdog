import React from 'react';
import styles from './UserTable.module.scss';
import { UserTableHeader } from './UserTableHeader/UserTableHeader';
import type { UserTableProps } from './types';
import { UserTableSkeleton } from '../../ui/SkeletonUi/UserTableSkeleton/UserTableSkeleton';
import { useUserTable } from './hooks/useUserTable';
import { UserTableRowSkeleton } from '../../ui/SkeletonUi/UserTableSkeleton/UserTableRowSkeleton';
import { UserCardSkeleton } from '../../ui/SkeletonUi/UserTableSkeleton/UserCardSkeleton';

export const UserTable: React.FC<UserTableProps> = (props) => {
    const { 
        users, onSelectAll, isFetchingMore, hasMore, 
        loading, sortBy, sortOrder, onSort 
    } = props;

    const {
        observerTarget,
        observerTargetMobile,
        scrollContainerRef,
        isSelectedAll,
        userRows,
        mobileCards
    } = useUserTable(props);

    if (loading) return <UserTableSkeleton />;

    return (
        <div className={styles['users-table-card']}>
            <div ref={scrollContainerRef} className={styles['users-table-card__wrapper']}>
                <table className={styles['users-table-card__content']}>
                    <UserTableHeader
                        onSelectAll={onSelectAll}
                        isSelectedAll={isSelectedAll}
                        onSort={onSort}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        isVendor={props.isVendor}
                    />
                    <tbody>
                        {userRows}
                        {users.length === 0 && !isFetchingMore && (
                            <tr>
                                <td colSpan={10} className={styles['users-table-card__td--empty']}>
                                    No se encontraron usuarios
                                </td>
                            </tr>
                        )}
                        {hasMore && (
                            isFetchingMore 
                                ? <>
                                    {[...Array(6)].map((_, i) => (
                                    <UserTableRowSkeleton key={i} ref={observerTarget} />))}
                                </>
                                : <tr ref={observerTarget} style={{ height: '1px', border: 'none' }}>
                                    <td colSpan={10} style={{ padding: 0 }} />
                                  </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className={styles['mobile-list']}>
                {mobileCards}
                {hasMore && (
                    <div ref={observerTargetMobile} className={styles['users-table-card__loader']}>
                        {isFetchingMore && <UserCardSkeleton />}
                    </div>
                )}
                {users.length === 0 && !isFetchingMore && (
                    <div className={styles['users-table-card__td--empty']}>
                        No se encontraron usuarios
                    </div>
                )}
            </div>
        </div>
    );
};
