
import React from 'react';
import styles from './CardLayoutForm.module.scss';
import { CustomTooltipUi } from '../CustomTooltipUi';

interface CardLayoutFormProps {
  title: string;
  icon: React.ReactNode;
  actions?: {title:string,icon:React.ReactNode  }[]; 
  children: React.ReactNode;   
}

export const CardLayoutForm = ({ title, icon, actions, children }: CardLayoutFormProps) => {
  return (
    <div className={styles['card-layout']}>
      <div className={styles['card-layout__header']}>
        <div className={styles['card-layout__title-group']}>
          {icon}
          <h3 className={styles['card-layout__title']}>{title}</h3>
        </div>

        {actions && actions.length > 0 && (
          <div className={styles['card-layout__actions']}>
            {actions.map((action, index) => (
              <CustomTooltipUi key={index} title={action.title}>
                  <span  className={`${styles['card-layout__action-item']}  p-1`}>
                  {action.icon}
                  </span>
                </CustomTooltipUi>
            ))}
          </div>
        )}
      </div>

      <div className={styles['card-layout__body']}>
        {children} 
      </div>
    </div>
  );
};