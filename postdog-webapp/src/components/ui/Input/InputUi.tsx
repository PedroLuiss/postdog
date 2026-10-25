import React, { forwardRef } from 'react';
import styles from './InputUi.module.scss';
import { Check, X as CloseIcon } from 'lucide-react';
import { useInputUi } from './hooks/useInputUi';

interface InputUiProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: React.ReactNode;
  error?: string;
  icon?: React.ReactNode;       
  prefix?: React.ReactNode;     
  suffixIcon?: React.ReactNode; 
  showCountString?: boolean;
  isValidCircle?: (value: string) => boolean; 
  containerClassName?: string;
  showMessageError?: boolean;
  showBadge?: boolean;
  isValid?: boolean;
  hideCount?: boolean;
  isInteger?: boolean;
}

const InputUi = forwardRef<HTMLInputElement, InputUiProps>((props, ref) => {
  const {
    label,
    error,
    icon,
    prefix,
    suffixIcon,
    className,
    containerClassName,
    showCountString,
    isValidCircle,
    maxLength,
    showMessageError = true,
    showBadge,
    isValid,
    hideCount,
    isInteger,
    ...rest
  } = props;

  const {
    internalValue,
    currentLength,
    canShowIndicators,
    showErrorBadge,
    showSuccessBadge,
    handleFocus,
    handleBlur,
    handleInternalChange,
  } = useInputUi({ ...props });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isInteger && rest.type === 'number') {
      if (['.', ',', 'e', 'E', '+', '-'].includes(e.key)) {
        e.preventDefault();
      }
    }
    if (props.onKeyDown) props.onKeyDown(e);
  };

  return (
    <div className={`${styles.field} ${containerClassName || ''}`}>
      {label && <label className={styles.field__label}>{label}</label>}

      <div className={styles.field__container}>
        {icon && <div className={styles['field__external-icon']}>{icon}</div>}

        <div className={styles['field__input-wrapper']}>
          {prefix && <span className={styles.field__prefix}>{prefix}</span>}

          <div className={styles['field__input-inner-container']}>
            <input
              ref={ref}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleInternalChange}
              onKeyDown={handleKeyDown}
              maxLength={maxLength} 
              className={`
                ${styles.field__input} 
                ${error ? styles['field__input--error'] : ''} 
                ${suffixIcon ? styles['field__input--has-suffix'] : ''}
                ${showCountString && !hideCount ? styles['field__input--has-counter'] : ''}
                ${props.readOnly ? styles['field__input--readOnly'] : ''}
                ${className}
              `}
              {...rest}
              value={props.value !== undefined ? props.value : internalValue}
            />
            
            {canShowIndicators && (
              <div className={`
                ${styles.field__indicators} 
                ${suffixIcon ? styles['field__indicators--with-suffix'] : ''}
              `}>
                {(showSuccessBadge || showErrorBadge) && (
                  <div className={`
                    ${styles['field__badge']} 
                    ${showErrorBadge ? styles['field__badge--error'] : styles['field__badge--success']}
                  `}>
                    {showErrorBadge ? <CloseIcon size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
                  </div>
                )}

                {showCountString && maxLength && !hideCount && (
                  <span className={styles.field__counter}>
                    {currentLength}/{maxLength}
                  </span>
                )}
              </div>
            )}

            {suffixIcon && (
              <div className={styles.field__suffix}>
                {suffixIcon}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && showMessageError && <span className={styles['field__error-message']}>{error}</span>}
    </div>
  );
});

InputUi.displayName = 'InputUi';

export default InputUi;