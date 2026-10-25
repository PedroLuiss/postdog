import React from 'react';
import { User, Phone, House } from 'lucide-react';
import styles from './AddresseeInfoCard.module.scss';
import { useAddresseeInfoCard } from './hooks/useAddresseeInfoCard';

const AddresseeInfoCard: React.FC = () => {
  const { fullName, phone, address } = useAddresseeInfoCard();

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
    </div>
  );
};

export default AddresseeInfoCard;