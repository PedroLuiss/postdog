
import React, { useRef, useEffect } from 'react';
import styles from './PickupsTable.module.scss';
import { BuildingIcon, EditIcon } from '../icons';
import { CustomTooltipUi } from '../ui/CustomTooltipUi';
import { SkeletonLoader } from '../ui';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';
import icon1 from "../../assets/img/order/icon1.png";
import { FormattedDateUtils } from '../../utils';
import { PickupsTableProps } from '../../types/pickups.type';

export const PickupsTable: React.FC<PickupsTableProps> = ({
  pickups,
  isLoading = false,
  error = null,
  onEditOrder,
}) => {

  if (isLoading) {
    return <div className={styles['table-list-pickups']}>< SkeletonLoader /></div>;
  }

  if (error) {
    return (
      <ErrorMessage message={error} />
    );
  }

  return (
    <div className={styles['table-list-pickups']}>
      {pickups.map((pickup) => (
        <div key={pickup.uid} className={styles['table-list-pickups__item']}>
          <div className={styles['table-list-pickups__grid']}>
            <div className={`${styles['table-list-pickups__cell']} ${styles['table-list-pickups__cell--sender']}`}>
              <span className={styles['table-list-pickups__title']}>Remitente</span>
              <div className={pickup.originAddress.fullName === null ? styles['table-list-pickups--pending-text'] : styles['table-list-pickups__cell--text']}>
                {pickup.originAddress.fullName === null ? 'Pendiente' : pickup.originAddress.fullName}
              </div>
              <div className={styles['table-list-pickups__address']}>{pickup.originAddress.postalCode} | {pickup.originAddress.colony}</div>
            </div>
            <div className={`${styles['table-list-pickups__cell']} ${styles['table-list-pickups__cell--package']}`}>
              <span className={styles['table-list-pickups__title']}>Paquete</span>
              <div className={pickup.package.packageType === null ? styles['table-list-pickups--pending-text'] : styles['table-list-pickups__cell--text']}>
                {pickup.package.packageType}
              </div>
              <div className={styles['table-list-pickups__details']}>{pickup.package.lengthCm}x{pickup.package.heightCm}x{pickup.package.widthCm} cm | {pickup.package.weightKg} kg</div>
            </div>

            <div className={`${styles['table-list-pickups__cell']} ${styles['table-list-pickups__cell--products']}`}>
              <span className={styles['table-list-pickups__title']}>Productos</span>
              <div className={pickup.products.quantity === 0 ? styles['table-list-orders--pending-text'] : styles['table-list-orders__cell--text']}>
                {pickup.products.quantity === 0 ? 'Pendiente' : `${pickup.products.quantity} producto${pickup.products.quantity !== 1 ? 's' : ''}`}
              </div>
            </div>

            <div className={`${styles['table-list-pickups__cell']} ${styles['table-list-pickups__cell--carrier']}`}>
              <span className={styles['table-list-pickups__title']}>Paquetería</span>
              {pickup.quoteCarrier.logoUrl && (
                <img src={pickup.quoteCarrier.logoUrl} alt={pickup.quoteCarrier.carrierName} className={styles['table-list-pickups__logo']} />
              )}
              <div className={pickup.quoteCarrier.carrierName === 'Pendiente' ? styles['table-list-pickups--pending-text'] : ''}>
                {pickup.quoteCarrier.carrierName}
              </div>
              {pickup.quoteCarrier.pickupAvailable && (
                <div className={styles['table-list-pickups__service']}>{pickup.quoteCarrier.pickupAvailable}</div>
              )}
            </div>

            <div className={`${styles['table-list-pickups__cell']} ${styles['table-list-pickups__cell--services']}`}>
              <div className={styles['table-list-pickups__cell--services__content']}>
                <img src={icon1} alt={''} className={styles['table-list-pickups__cell--services__logo']} />
                {
                  <><p className={styles['table-list-pickups__cell--services__text-code']}>{"#00000"}</p></>
                }
              </div>
            </div>

            <div className={`${styles['table-list-pickups__cell']} ${styles['table-list-pickups__cell--actions']}`}>
              <div className={styles['table-list-pickups__datetime']}>
                <span>{FormattedDateUtils(pickup.createdAt, "dd/MM/yyyy h:mm a")}</span>
              </div>
              <div className={styles['table-list-pickups__action-wrapper']}>
                <div>
                  {/* {pickup.status === 'GENERATED' && (
                    <CustomTooltipUi title="Guía Generada" placement='bottom'>
                      <button className={styles['table-list-pickups__icon-button']}>
                        <BuildingIcon />
                      </button>
                    </CustomTooltipUi>

                  )} */}
                  {pickup.status === 'GENERATED' && (
                    <CustomTooltipUi title="Ver detalle" placement='bottom'>
                      <button className={styles['table-list-pickups__icon-button']}>
                        <BuildingIcon />
                      </button>
                    </CustomTooltipUi>
                  )}
                  {(pickup.status === 'PENDING') && (
                    <CustomTooltipUi title="Continuar envío" placement='bottom'>
                      <button onClick={() => { onEditOrder && onEditOrder(pickup) }} className={styles['table-list-pickups__icon-button']}>
                        <EditIcon />
                      </button>
                    </CustomTooltipUi>
                  )}
                </div>
                {/* Actions removed for inmutability */}
              </div>
            </div>
          </div>
        </div>
      ))}

      {isLoading && pickups.length === 0 && (
        <div className={styles['table-list-pickups']}><SkeletonLoader count={3} type="order-card" /></div>
      )}
    </div>
  );
};