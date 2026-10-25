import React from 'react';
import styles from './PickupsListSection.module.scss';
import { CalendarClock } from 'lucide-react';
import { ScheduledPickupsTable } from '../ScheduledPickupsTable/ScheduledPickupsTable';
import { ScheduledPickup, PickupsListSectionProps } from '../../../types/pickups.type';

export const PickupsListSection: React.FC<PickupsListSectionProps> = ({
    pickups,
    isLoading,
    hasMore,
    onLoadMore,
    onProgramarRecoleccion
}) => {
    return (
        <div className={styles['pickups-list-section']}>
            <div className={styles['pickups-list-section__header']}>
                <button
                    className={styles['btn-primary-red']}
                    onClick={onProgramarRecoleccion}
                >
                    <CalendarClock />
                    Programar recolección
                </button>
            </div>
            <ScheduledPickupsTable pickups={pickups} isLoading={isLoading} hasMore={hasMore} onLoadMore={onLoadMore} />
        </div>
    );
};
