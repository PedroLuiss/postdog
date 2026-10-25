import React, { useEffect, useRef } from 'react';
import styles from './ScheduledPickupsTable.module.scss';
import { ScheduledPickupsTableProps } from '../../../types/pickups.type';
import { SkeletonLoader } from '../../ui';
import { formatPickupDate } from '../../../utils/pickup.utils';
import { ImgUi } from '../../ui/ImgUi/ImgUi';

export const ScheduledPickupsTable: React.FC<ScheduledPickupsTableProps> = ({
    pickups,
    isLoading,
    hasMore,
    onLoadMore
}) => {
    const observerTarget = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !isLoading && onLoadMore) {
                    onLoadMore();
                }
            },
            { threshold: 1.0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasMore, isLoading, onLoadMore]);

    if (isLoading && pickups.length === 0) {
        return (
            <div className={styles['scheduled-pickups-table-container']}>
                <SkeletonLoader count={1} type="pickup-card" />
            </div>
        );
    }

    if (pickups.length === 0) {
        return (
            <div className={styles['scheduled-pickups-table--empty']}>
                No tienes recolecciones programadas actualmente.
            </div>
        );
    }

    return (
        <div className={styles['scheduled-pickups-table-container']}>
            <div className={styles['scheduled-pickups-table-wrapper']}>
                <table className={styles['scheduled-pickups-table']}>
                    <thead>
                        <tr>
                            <th className={`${styles['scheduled-pickups-table__th']} ${styles['scheduled-pickups-table__th--number']}`}>
                                Número de recolección
                            </th>
                            <th className={styles['scheduled-pickups-table__th']}>
                                Paquetería
                            </th>
                            <th className={styles['scheduled-pickups-table__th']}>
                                Lugar de recolección
                            </th>
                            <th className={styles['scheduled-pickups-table__th']}>
                                Fecha de recolección
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {pickups.map((pickup) => (
                            <tr key={pickup.id}>
                                <td className={styles['scheduled-pickups-table__td--number']}>
                                    <span className={styles['scheduled-pickups-table__pickup-number']}>#{pickup.pickupNumber}</span>
                                </td>
                                <td>
                                    <div className={styles['scheduled-pickups-table__flex']}>
                                        {pickup.carrierLogoUrl && (
                                            <ImgUi
                                                src={pickup.carrierLogoUrl}
                                                alt={pickup.carrier}
                                                className={styles['scheduled-pickups-table__logo']}
                                            />
                                        )}
                                        {!pickup.carrierLogoUrl && <span className={styles['scheduled-pickups-table__text-sm']}>{pickup.carrier}</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className={`${styles['scheduled-pickups-table__text-sm']} ${styles['scheduled-pickups-table__text-sm--max-w-xs']}`}>
                                        {pickup.pickupAddress}
                                    </div>
                                </td>
                                <td>
                                    <div className={`${styles['scheduled-pickups-table__text-sm']} ${styles['scheduled-pickups-table__text-sm--font-medium']}`}>
                                        {formatPickupDate(pickup.pickupDate)}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles['scheduled-pickups-cards']}>
                {pickups.map((pickup) => (
                    <div key={pickup.id} className={styles['scheduled-pickups-card']}>
                        <div className={styles['scheduled-pickups-card__header']}>
                            <span className={styles['scheduled-pickups-card__number']}>#{pickup.pickupNumber}</span>
                        </div>
                        <div className={styles['scheduled-pickups-card__carrier']}>
                            {pickup.carrierLogoUrl && (
                                <img
                                    src={pickup.carrierLogoUrl}
                                    alt={pickup.carrier}
                                    className={styles['scheduled-pickups-card__logo']}
                                />
                            )}
                            {!pickup.carrierLogoUrl && <span>{pickup.carrier}</span>}
                        </div>

                        <div className={styles['scheduled-pickups-card__divider']} />

                        <div className={styles['scheduled-pickups-card__section']}>
                            <span className={styles['scheduled-pickups-card__label-address']}>Lugar de recolección</span>
                            <span className={styles['scheduled-pickups-card__address']}>{pickup.pickupAddress}</span>
                        </div>

                        <div className={styles['scheduled-pickups-card__section']}>
                            <span className={styles['scheduled-pickups-card__label']}>Fecha de recolección</span>
                            <span className={styles['scheduled-pickups-card__date']}>{formatPickupDate(pickup.pickupDate)}</span>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div ref={observerTarget} style={{ padding: '24px' }}>
                    <SkeletonLoader count={1} type="pickup-card" />
                </div>
            )}
        </div>
    );
};
