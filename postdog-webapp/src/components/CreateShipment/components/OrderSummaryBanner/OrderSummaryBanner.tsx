import React from 'react';
import styles from './OrderSummaryBanner.module.scss';
import { ImgUi } from '../../../ui/ImgUi/ImgUi';

interface OrderSummaryBannerProps {
    orderNumber?: string;
    status?: string;
    date?: string;
    shipmentType?: string;
    total?: string;
    logoUrl?: string;
}

export const OrderSummaryBanner: React.FC<OrderSummaryBannerProps> = ({
    orderNumber = "#144488",
    status = "Pedido pagado",
    date = "14/01/2025, 04:44 a.m.",
    shipmentType = "ENVÍO ESTÁNDAR (4-6 DÍAS)",
    total = "$109",
    logoUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png"
}) => {
    return (
        <div className={styles['order-banner']}>
            <div className={styles['order-banner__container']}>
                <div className={styles['order-banner__logo-wrapper']}>
                    <ImgUi 
                        src={logoUrl} 
                        alt="Logo" 
                    />
                </div>
                
                <div className={styles['order-banner__content']}>
                    <div className={styles['order-banner__header']}>
                        <span className={styles['order-banner__order-number']}>{orderNumber}</span>
                        <span className={styles['order-banner__status-badge']}>{status}</span>
                    </div>
                    <div className={styles['order-banner__details']}>
                        {date} • {shipmentType} • {total}
                    </div>
                </div>
            </div>
        </div>
    );
};