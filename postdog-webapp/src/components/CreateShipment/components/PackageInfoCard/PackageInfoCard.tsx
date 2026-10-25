import React from 'react';
import { Box as BoxIcon, Weight, FileText } from 'lucide-react';

import styles from './PackageInfoCard.module.scss';
import { usePackageInfoCard } from './hooks/usePackageInfoCard';

const PackageInfoCard: React.FC = () => {
  const { dimensions, weight, productType, totalPackages } = usePackageInfoCard();

  return (
    <div className={styles['package-info__details']}>

      {/* {totalPackages > 1 && (
        <div className={styles['package-info__item']}>
          <div className={styles['package-info__badge']}>
            <Layers size={14} />
          </div>
          <span style={{ fontWeight: 600, color: '#dc2626' }}>
            {totalPackages} paquetes en total
          </span>
        </div>
      )} */}

      <div className={styles['package-info__item']}>
        <div className={styles['package-info__badge']}>
          <BoxIcon size={14} />
        </div>
        <span>{dimensions} {totalPackages > 1 && `(+${totalPackages - 1} más)`}</span>
      </div>

      <div className={styles['package-info__item']}>
        <div className={styles['package-info__badge']}>
          <Weight size={14} />
        </div>
        <span>{weight}</span>
      </div>

      <div className={styles['package-info__item']}>
        <div className={styles['package-info__badge']}>
          <FileText size={14} />
        </div>
        <span>{productType}</span>
      </div>
    </div>
  );
};

export default PackageInfoCard;