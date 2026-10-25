import React from 'react';
import styles from './GlobalAlertsTable.module.scss';
import { GlobalAlertsTableProps } from './types';
import { GlobalAlertsTableRow } from './GlobalAlertsTableRow/GlobalAlertsTableRow';
import { GlobalAlertsMobileCard } from './GlobalAlertsMobileCard/GlobalAlertsMobileCard';
import { GlobalAlertsTableRowSkeleton, GlobalAlertsSkeleton } from '../../ui/SkeletonUi/GlobalAlertsSkeleton';

export const GlobalAlertsTable = React.memo(({
    alerts,
    onDelete,
    onEdit,
    onReschedule,
    onTogglePin,
    isFetchingMore,
    hasMore,
    loading,
    observerTarget,
    isReadOnly = false
}: GlobalAlertsTableProps) => {
    return (
        <div className={styles['global-alerts-table']}>
            <div className={styles['global-alerts-table__wrapper']}>
                {loading && alerts.length === 0 ? (
                    <GlobalAlertsSkeleton />
                ) : alerts.length > 0 ? (
                    <>
                        <div className={styles['table-container']}>
                            <table className={styles['global-alerts-table__content']}>
                                <thead className={styles['global-alerts-table__thead']}>
                                    <tr>
                                        <th className={`${styles['global-alerts-table__th']} ${styles['global-alerts-table__th--center']}`}>Fijar</th>
                                        <th className={styles['global-alerts-table__th']}>Título</th>
                                        <th className={`${styles['global-alerts-table__th']} ${styles['global-alerts-table__th--hide-md']}`}>Mensaje</th>
                                        <th className={`${styles['global-alerts-table__th']} ${styles['global-alerts-table__th--hide-sm']}`}>Prioridad</th>
                                        <th className={`${styles['global-alerts-table__th']} ${styles['global-alerts-table__th--hide-lg']}`}>Fecha de envío</th>
                                        {!isReadOnly && <th className={`${styles['global-alerts-table__th']} ${styles['global-alerts-table__th--right']}`}></th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {alerts.map((alert) => (
                                        <GlobalAlertsTableRow
                                            key={alert.uid}
                                            alert={alert}
                                            onDelete={onDelete}
                                            onEdit={onEdit}
                                            onReschedule={onReschedule}
                                            onTogglePin={onTogglePin}
                                            isReadOnly={isReadOnly}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles['mobile-list']}>
                            {alerts.map((alert) => (
                                <GlobalAlertsMobileCard 
                                    key={alert.uid}
                                    alert={alert}
                                    onDelete={onDelete}
                                    onEdit={onEdit}
                                    onReschedule={onReschedule}
                                    onTogglePin={onTogglePin}
                                    isReadOnly={isReadOnly}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className={styles['global-alerts-table__empty']}>
                        <p>No se encontraron alertas programadas.</p>
                    </div>
                )}

                {!loading && hasMore && (
                    <div ref={observerTarget} className={styles['global-alerts-table__observer-target']}>
                        {isFetchingMore && (
                            <>
                                <div className={styles['table-container']}>
                                    <table className={styles['global-alerts-table__content']}>
                                        <tbody>
                                            <GlobalAlertsTableRowSkeleton />
                                            <GlobalAlertsTableRowSkeleton />
                                            <GlobalAlertsTableRowSkeleton />
                                        </tbody>
                                    </table>
                                </div>
                                <div className={styles['mobile-list']}>
                                    {[...Array(2)].map((_, i) => (
                                      <div key={i} className={styles['alert-card']}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div style={{ width: '60%', height: '20px', background: '#f3f4f6', borderRadius: '4px' }} />
                                            <div style={{ width: '40px', height: '20px', background: '#f3f4f6', borderRadius: '10px' }} />
                                          </div>
                                          <div style={{ width: '100%', height: '40px', background: '#f3f4f6', borderRadius: '4px' }} />
                                        </div>
                                      </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});