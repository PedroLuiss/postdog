import React from 'react';
import styles from './ShipmentItemSkeleton.module.scss';
import { SkeletonUi } from '../../../ui/SkeletonUi/SkeletonUi';

export const ShipmentItemSkeleton: React.FC = () => {
  return (
    <div className={styles['shipment-skeleton']}>
      
      <div className={styles['shipment-skeleton__desktop']}>
        <div className={styles['shipment-skeleton__header']}>
          <div className={styles['shipment-skeleton__header-left']}>
            <SkeletonUi width={20} height={20} borderRadius="4px" /> 
            <SkeletonUi width={32} height={32} borderRadius="6px" /> 
            <div className={styles['shipment-skeleton__info-main']}>
              <div className={styles['shipment-skeleton__id-row']}>
                <SkeletonUi width={80} height={18} borderRadius="4px" /> 
                <SkeletonUi width={180} height={18} borderRadius="12px" /> 
              </div>
              <SkeletonUi width={120} height={12} borderRadius="4px" /> 
            </div>
          </div>
          <SkeletonUi width={120} height={24} borderRadius="12px" /> 
        </div>

        <div className={styles['shipment-skeleton__grid']}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles['shipment-skeleton__col']}>
              <SkeletonUi width={60} height={10} borderRadius="2px" /> 
              <SkeletonUi width="80%" height={16} borderRadius="4px" /> 
            </div>
          ))}
        </div>

        <div className={styles['shipment-skeleton__footer']}>
          <div className={styles['shipment-skeleton__tags']}>
            <SkeletonUi width={80} height={22} borderRadius="12px" />
            <SkeletonUi width={80} height={22} borderRadius="12px" />
            <SkeletonUi width={100} height={22} borderRadius="12px" />
          </div>
          <div className={styles['shipment-skeleton__actions']}>
            <SkeletonUi width={36} height={36} borderRadius="8px" />
            <SkeletonUi width={36} height={36} borderRadius="8px" />
            <SkeletonUi width={36} height={36} borderRadius="8px" />
          </div>
        </div>
      </div>

      <div className={styles['shipment-skeleton__mobile']}>
        <div className={styles['shipment-skeleton__mobile-header']}>
          <SkeletonUi width={20} height={20} borderRadius="4px" />
          <div className={styles['shipment-skeleton__mobile-info']}>
            <div className={styles['shipment-skeleton__mobile-row-top']}>
              <SkeletonUi width={24} height={24} borderRadius="4px" />
              <SkeletonUi width={60} height={16} borderRadius="4px" />
              <SkeletonUi width={12} height={12} borderRadius="50%" />
            </div>
            <SkeletonUi width={100} height={12} borderRadius="4px" />
            <SkeletonUi width={140} height={16} borderRadius="4px" />
          </div>
        </div>

        <div className={styles['shipment-skeleton__mobile-grid']}>
          <div className={styles['shipment-skeleton__mobile-col']}>
            <SkeletonUi width={50} height={10} />
            <SkeletonUi width={40} height={24} />
          </div>
          <div className={styles['shipment-skeleton__mobile-col']}>
            <SkeletonUi width={50} height={10} />
            <SkeletonUi width={60} height={20} />
          </div>
          <div className={styles['shipment-skeleton__mobile-col-span']}>
            <SkeletonUi width={80} height={10} />
            <SkeletonUi width="90%" height={32} borderRadius="6px" />
          </div>
        </div>
        <SkeletonUi width="100%" height={36} borderRadius="8px" /> 
      </div>

    </div>
  );
};