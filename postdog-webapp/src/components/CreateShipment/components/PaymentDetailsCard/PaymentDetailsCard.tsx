import React from 'react';
import styles from './PaymentDetailsCard.module.scss';

interface PaymentDetailsCardProps {
  shippingPrice: number;
  insurancePrice?: number;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({ 
  shippingPrice, 
  insurancePrice = 0 
}) => {
  
  const total = shippingPrice + insurancePrice;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  return (
    <div className={styles['payment-card']}>
      <div className={styles['payment-card__container']}>
        
        <div className={styles['payment-card__header']}>
          <span className={styles['payment-card__title']}>Detalles de pago</span>
        </div>
        <div className={styles['payment-card__body']}>
          
          <div className={styles['payment-card__row']}>
            <span className={styles['payment-card__row-label']}>Envío</span>
            <span className={styles['payment-card__row-value']}>
              {formatCurrency(shippingPrice)} MXN
            </span>
          </div>

          {insurancePrice > 0 && (
            <div className={styles['payment-card__row']}>
              <span className={styles['payment-card__row-label']}>Seguro PawSafe</span>
              <span className={styles['payment-card__row-value']}>
                {formatCurrency(insurancePrice)} MXN
              </span>
            </div>
          )}

          <div className={styles['payment-card__footer']}>
            <span className={styles['payment-card__total-label']}>Total:</span>
            
            <div className={styles['payment-card__total-amount-group']}>
              <div className={styles['payment-card__total-value']}>
                {formatCurrency(total)} MXN
              </div>
              <div className={styles['payment-card__tax-label']}>
                (incluye IVA)
              </div>
            </div>
          </div>
        </div>

        <p className={styles['payment-card__legal-text']}>
          Al generar el envío, confirmo que he leído y acepto los 
          <a href="#!"> términos y políticas</a>.

        </p>

      </div>
    </div>
  );
};

export default PaymentDetailsCard;