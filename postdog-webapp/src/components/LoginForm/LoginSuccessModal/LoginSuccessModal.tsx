import React from 'react';
import { CircleCheckBig } from 'lucide-react';
import styles from './LoginSuccessModal.module.scss';

interface LoginSuccessModalProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export const LoginSuccessModal: React.FC<LoginSuccessModalProps> = ({ 
  onConfirm, 
  title = "¡Perfecto!", 
  description = "Inicio de sesión exitoso. ¡Bienvenido de vuelta!" 
}) => {
  return (
    <div 
      className={styles['success-modal']}
      onClick={(e) => e.stopPropagation()}
    >
      <div 
        className={styles['success-modal__content']}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className={styles['success-modal__icon-container']}>
          <div className={styles['success-modal__icon-wrapper']}>
            <CircleCheckBig className={styles['success-modal__icon']} />
          </div>
          
          <h2 className={styles['success-modal__title']}>{title}</h2>
          <p className={styles['success-modal__description']}>
            {description}
          </p>
        </div>

        <button 
          className={styles['success-modal__button']}
          onClick={onConfirm}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};