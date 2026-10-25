import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import styles from './ResendEmailForm.module.scss';
import { ResendEmailFormProps } from './types';

export const ResendEmailForm: React.FC<ResendEmailFormProps> = ({
  email,
  onEmailChange,
  onSubmit,
  onBack,
  loading = false,
  error
}) => {
  return (
    <div className={styles['resend-form']}>
      
      <div className={styles['resend-form__header']}>
        <h1 className={styles['resend-form__title']}>¿No recibiste el correo?</h1>
        <p className={styles['resend-form__subtitle']}>
          No te preocupes, podemos enviarte nuevamente las instrucciones de recuperación.
        </p>
      </div>

      <form className={styles['resend-form__form']} onSubmit={onSubmit}>
        <div className={styles['resend-form__field']}>
          <label className={styles['resend-form__label']}>
            Correo electrónico<span>*</span>
          </label>
          <input
            type="email"
            className={`${styles['resend-form__input']} ${error ? styles['resend-form__input--invalid'] : ''}`}
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
          />
          {error && <span className={styles['resend-form__error']}>{error}</span>}
        </div>

        <button 
          className={styles['resend-form__submit-btn']}
          type="submit"
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Reenviar correo'}
        </button>

        <div className={styles['resend-form__footer']}>
          <a 
            className={styles['resend-form__back-link']}
            onClick={onBack}
          >
            <ArrowLeft size={16} />
            Volver a recuperación de contraseña
          </a>
        </div>
      </form>
      
    </div>
  );
};