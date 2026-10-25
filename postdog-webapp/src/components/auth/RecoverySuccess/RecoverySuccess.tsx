import React from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import styles from './RecoverySuccess.module.scss';
import { RecoverySuccessProps } from './types';

export const RecoverySuccess: React.FC<RecoverySuccessProps> = ({ onResend, onBackToLogin }) => {
  return (
    <div className={styles['recovery-success']}>
      
      <div className={styles['recovery-success__icon-container']}>
        <div className={styles['recovery-success__icon-circle']}>
          <Mail className={styles['recovery-success__icon']} />
        </div>
      </div>

      <div className={styles['recovery-success__content']}>
        <h1 className={styles['recovery-success__title']}>Correo enviado</h1>
        <p className={styles['recovery-success__description']}>
          Te enviamos un correo con las instrucciones para recuperar tu contraseña
        </p>
      </div>

      <div className={styles['recovery-success__actions']}>
        <p className={styles['recovery-success__help-text']}>
          ¿No recibiste el correo de recuperación?
        </p>
        
        <button 
          className={styles['recovery-success__resend-btn']}
          onClick={onResend}
          type="button"
        >
          Reenviar correo
        </button>

        <div className={styles['recovery-success__footer']}>
          <a 
            className={styles['recovery-success__back-link']} 
            onClick={onBackToLogin}
          >
            <ArrowLeft size={16} />
            Iniciar sesión
          </a>
        </div>
      </div>
      
    </div>
  );
};