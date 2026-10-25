import React from 'react';
import { CircleX } from 'lucide-react';
import styles from './AuthErrorModal.module.scss';
import { AuthErrorModalProps } from './types';

export const AuthErrorModal: React.FC<AuthErrorModalProps> = ({ 
  isOpen,
  onClose, 
  title = "Algo salió mal", 
  description = "No pudimos completar la acción. Por favor, revisa la información e intenta de nuevo." 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className={styles['error-modal']}
      onClick={onClose}
    >
      <div 
        className={styles['error-modal__content']}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className={styles['error-modal__icon-container']}>
          <div className={styles['error-modal__icon-wrapper']}>
            <CircleX className={styles['error-modal__icon']} />
          </div>
          
          <h2 className={styles['error-modal__title']}>{title}</h2>
          <p className={styles['error-modal__description']}>
            {description}
          </p>
        </div>

        <button 
          className={styles['error-modal__button']}
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
