import React from 'react';
import styles from './ErrorMessage.module.scss';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorMessageProps {
  title?: string;
  message: string | null;
  className?: string; 
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = "Ocurrió un error",
  message,
  className = '', 
  onRetry,
}) => {
  if (!message) {
    return null;
  }

  const blockClass = styles['error-message'];

  return (
    <div className={`${blockClass} ${className}`} role="alert">
      <div className={styles['error-message__icon']}>
        <ErrorOutlineIcon />
      </div>
      <div className={styles['error-message__content']}>
        <h4 className={styles['error-message__title']}>{title}</h4>
        <p className={styles['error-message__message']}>{message}</p>
      </div>
      {onRetry && (
        <button className={styles['error-message__retry-button']} onClick={onRetry}>
          Reintentar
        </button>
      )}
    </div>
  );
};