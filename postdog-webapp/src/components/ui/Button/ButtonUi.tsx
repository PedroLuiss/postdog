import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'light' | 'icon-circle' | 'dark-red';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean; 
  children?: ReactNode;
  className?: string;
}

const ButtonUi = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    isLoading = false, 
    icon, 
    iconPosition = 'left', 
    children, 
    className = '', 
    disabled, 
    fullWidth = false,
    ...props 
  }, ref) => {

    const buttonClasses = [
      styles.btn,
      styles[`btn--${variant}`],
      isLoading ? styles['btn--loading'] : '',
      className,
      fullWidth ? styles['btn--fullWidth'] : ''
    ].join(' ').trim();

    return (
      <button
        ref={ref}
        className={buttonClasses + ' ' + className}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <span className={styles.btn__spinner} />}
        
        {!isLoading && icon && iconPosition === 'left' && icon}
        
        {!isLoading && children && <span className={styles.btn__text}>{children}</span>}
        
        {!isLoading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

ButtonUi.displayName = 'ButtonUi';

export default ButtonUi;