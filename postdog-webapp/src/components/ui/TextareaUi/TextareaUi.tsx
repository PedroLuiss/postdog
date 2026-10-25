import React, { forwardRef } from 'react';
import styles from './TextareaUi.module.scss';
import { Check, X as CloseIcon } from 'lucide-react';
import { useTextareaUi } from './hooks/useTextareaUi';

interface TextareaUiProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  error?: string;
  showCountString?: boolean;
  containerClassName?: string;
  showMessageError?: boolean;
  required?: boolean;
  showBadge?: boolean;
  isValid?: boolean;
}

const TextareaUi = forwardRef<HTMLTextAreaElement, TextareaUiProps>((props, ref) => {
  const {
    label,
    error,
    className,
    containerClassName,
    showCountString,
    maxLength,
    showMessageError = true,
    required,
    value,
    showBadge,
    isValid,
    ...rest
  } = props;

  const {
    currentLength,
    canShowIndicators,
    showErrorBadge,
    showSuccessBadge,
    handleFocus,
    handleBlur,
  } = useTextareaUi({ value, ...props });

  return (
    <div className={`${styles.field} ${containerClassName || ''}`}>
      {label && (
        <label className={styles.field__label}>
          {label} {required && <span className={styles['field__label-required']}>*</span>}
        </label>
      )}

      <div className={styles.field__container}>
        <textarea
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          value={value}
          className={`
            ${styles.field__textarea} 
            ${error ? styles['field__textarea--error'] : ''} 
            ${className || ''}
          `}
          {...rest}
        />

        {canShowIndicators && (
          <div className={styles.field__indicators}>
            {(showSuccessBadge || showErrorBadge) && (
              <div className={`
                ${styles['field__badge']} 
                ${showErrorBadge ? styles['field__badge--error'] : styles['field__badge--success']}
              `}>
                {showErrorBadge ? <CloseIcon size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
              </div>
            )}
            
            {showCountString && maxLength && (
              <span className={styles.field__counter}>
                {currentLength}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>

      {error && showMessageError && (
        <span className={styles['field__error-message']}>{error}</span>
      )}
    </div>
  );
});

TextareaUi.displayName = 'TextareaUi';

export default TextareaUi;