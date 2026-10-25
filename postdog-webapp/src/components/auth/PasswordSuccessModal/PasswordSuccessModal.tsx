import React from 'react';
import { CircleCheckBig } from 'lucide-react';
import styles from './PasswordSuccessModal.module.scss';
import { useNavigate } from 'react-router-dom';
import { PasswordSuccessModalProps } from './types';

export const PasswordSuccessModal: React.FC<PasswordSuccessModalProps> = ({ 
  isOpen
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  return (
    <div className={styles['success-modal']}>
      <div className={styles['success-modal__content']}>
        
        <div className={styles['success-modal__icon-container']}>
          <div className={styles['success-modal__icon-wrapper']}>
            <CircleCheckBig className={styles['success-modal__icon']} />
          </div>
          
          <h2 className={styles['success-modal__title']}>¡Listo!</h2>
          <p className={styles['success-modal__description']}>
            Cambiaste tu contraseña
          </p>
        </div>

        <button 
          className={styles['success-modal__button']}
          onClick={() => navigate('/login')}
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
};
