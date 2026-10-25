import React from 'react';
import styles from './RecentShipments.module.scss';
import { RecentShipmentsProps } from '../../../types/dashboard.type';
import { useRecentShipments } from '../../../hooks/useRecentShipments';
import { getShipmentStatusInfo } from '../../../utils/shipmentStatus.utils';
import { RecentShipmentsSkeleton } from '../../ui/SkeletonUi/RecentShipmentsSkeleton/RecentShipmentsSkeleton';

const RecentShipments: React.FC<RecentShipmentsProps> = ({ onAction }) => {
    const { recentShipments, isLoading } = useRecentShipments();

    if (isLoading) {
        return <RecentShipmentsSkeleton />;
    }

    return (
        <section className={styles['recent-shipments']}>
            <div className={styles['recent-shipments__header']}>
                <h3 className={styles['recent-shipments__title']}>Últimos envíos</h3>
                <button 
                    className={styles['recent-shipments__link']} 
                    onClick={() => onAction('Ver historial')}
                >
                    Ver historial
                </button>
            </div>

            <div className={styles['recent-shipments__list']}>
                {recentShipments.length > 0 ? (
                    recentShipments.map((shipment) => {
                        const statusInfo = getShipmentStatusInfo(shipment.status);
                        const statusClass = `${styles['recent-shipment-item__status']} ${styles[`recent-shipment-item__status--${statusInfo.type}`]}`;

                        return (
                            <div key={shipment.uid} className={styles['recent-shipment-item']}>
                                <div className={styles['recent-shipment-item__info']}>
                                    <img 
                                        src={shipment.carrierLogo} 
                                        alt={shipment.carrierName} 
                                        className={styles['recent-shipment-item__logo']} 
                                    />
                                    <div className={styles['recent-shipment-item__details']}>
                                        <p className={styles['recent-shipment-item__id']}>{shipment.trackingNumber}</p>
                                        <p className={styles['recent-shipment-item__description']}>{shipment.recipientName}</p>
                                    </div>
                                </div>
                                <div className={statusClass}>
                                    <span className={styles['recent-shipment-item__dot']}>{statusInfo.dot}</span>
                                    {statusInfo.label}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className={styles['recent-shipments__empty']}>
                        No hay envíos recientes para mostrar.
                    </p>
                )}
            </div>
        </section>
    );
};

export default RecentShipments;