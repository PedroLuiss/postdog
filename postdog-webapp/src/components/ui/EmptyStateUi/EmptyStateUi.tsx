import React, { ReactNode } from 'react';
import { PawPrint } from 'lucide-react';
import styles from './EmptyStateUi.module.scss';

interface EmptyStateUiProps {
  icon: ReactNode;        
  title?: string;          
  description: string;     
  actions?: ReactNode;     
  className?: string;
}

export const EmptyStateUi: React.FC<EmptyStateUiProps> = ({
  icon,
  title,
  description,
  actions,
  className = ""
}) => {
  return (
    <div className={`${styles['empty-state']} ${className}`}>
      
      <div className={styles['empty-state__icon-container']}>
        {icon}
        <div className={styles['empty-state__badge']}>
          <PawPrint />
        </div>
      </div>

      <div className={styles['empty-state__text-group']}>
        {title && <h3 className={styles['empty-state__title']}>{title}</h3>}
        <p className={styles['empty-state__description']}>{description}</p>
      </div>
      {actions && (
        <div className={styles['empty-state__actions']}>
          {actions}
        </div>
      )}
      
    </div>
  );
};