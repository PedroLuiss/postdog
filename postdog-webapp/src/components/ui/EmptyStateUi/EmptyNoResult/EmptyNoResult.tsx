import React, { ReactNode } from 'react';
import {  Plus } from 'lucide-react';
import styles from './EmptyNoResult.module.scss';
import ButtonUi from '../../Button/ButtonUi';

interface EmptyNoResultProps {
  title: string;
  description: string;
  mainIcon: ReactNode;    
  badgeIcon?: ReactNode;   
  actionLabel?: string;     
  onAction?: () => void;    
}

export const EmptyNoResult: React.FC<EmptyNoResultProps> = ({
  title,
  description,
  mainIcon,
  badgeIcon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className={styles['empty-no-result']}>

      <div className={styles['empty-no-result__illustration']}>
        <div className={styles['empty-no-result__circle-main']}>
          <div className={styles['empty-no-result__icon-primary']}>
            {mainIcon}
          </div>
          
          {badgeIcon && (
            <div className={styles['empty-no-result__badge']}>
              <div className={styles['empty-no-result__icon-secondary']}>
                {badgeIcon}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles['empty-no-result__text-group']}>
        <h2 className={styles['empty-no-result__title']}>{title}</h2>
        <p className={styles['empty-no-result__description']}>{description}</p>
      </div>
      {actionLabel && onAction && (
        <div className={styles['empty-no-result__actions']}>
          <ButtonUi 
            variant="primary" 
            icon={<Plus size={18} />} 
            onClick={onAction}
          >
            {actionLabel}
          </ButtonUi>
        </div>
      )}
    </div>
  );
};