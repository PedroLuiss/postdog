import React from 'react';
import styles from '../../../GlobalAlerts/GlobalAlertsTable/GlobalAlertsTable.module.scss';
import { GlobalAlertsTableRowSkeleton } from './GlobalAlertsTableRowSkeleton/GlobalAlertsTableRowSkeleton';

export const GlobalAlertsSkeleton: React.FC = () => {
    return (
        <table className={styles['global-alerts-table__content']}>
            <thead>
                <tr>
                    <th className={styles['global-alerts-table__th']}>Fijar</th>
                    <th className={styles['global-alerts-table__th']}>Título</th>
                    <th className={styles['global-alerts-table__th']}>Mensaje</th>
                    <th className={styles['global-alerts-table__th']}>Fecha de envío</th>
                    <th className={`${styles['global-alerts-table__th']} ${styles['global-alerts-table__th--right']}`}>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <GlobalAlertsTableRowSkeleton />
                <GlobalAlertsTableRowSkeleton />
                <GlobalAlertsTableRowSkeleton />
                <GlobalAlertsTableRowSkeleton />
                <GlobalAlertsTableRowSkeleton />
            </tbody>
        </table>
    );
};
