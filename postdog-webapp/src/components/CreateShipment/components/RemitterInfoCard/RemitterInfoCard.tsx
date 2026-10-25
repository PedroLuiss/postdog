import React from 'react';
import { User, Phone, House, FileText } from 'lucide-react';
import styles from './RemitterInfoCard.module.scss';
import { useRemitterInfoCard } from './hooks/useRemitterInfoCard';

const RemitterInfoCard: React.FC = () => {
  const { fullName, phone, address, rfc } = useRemitterInfoCard();

  return (
    <div className={styles['package-info__details']}>
      <div className={styles['package-info__item']}>
        <div className={styles['package-info__badge']}>
          <User size={14} />
        </div>
        <span>{fullName}</span>
      </div>

      <div className={styles['package-info__item']}>
        <div className={styles['package-info__badge']}>
          <Phone size={14} />
        </div>
        <span>{phone}</span>
      </div>

      <div className={styles['package-info__item']}>
        <div className={styles['package-info__badge']}>
          <House size={14} />
        </div>
        <span className={styles['package-info__address-text']}>
          {address}
        </span>
      </div>

      {rfc && (
        <div className={styles['package-info__item']}>
          <div className={styles['package-info__badge']}>
            <FileText size={14} />
          </div>
          <span>{rfc}</span>
        </div>
      )}
    </div>
  );
};

export default RemitterInfoCard;