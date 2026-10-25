import React from 'react';
import styles from './SwitchUi.module.scss';

interface SwitchUiProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const SwitchUi: React.FC<SwitchUiProps> = ({ 
  label, 
  checked, 
  onChange, 
  disabled, 
  className, 
  id,
  ...props 
}) => {
  return (
    <label 
      className={`
        ${styles['switch-ui']} 
        ${disabled ? styles['switch-ui--disabled'] : ''} 
        ${className || ''}
      `}
    >
      <input
        type="checkbox"
        id={id}
        className={styles['switch-ui__input']}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        {...props}
      />
      
      <div className={`${styles['switch-ui__track']} ${checked ? styles['switch-ui__track--checked'] : ''}`}>
        <span className={`${styles['switch-ui__thumb']} ${checked ? styles['switch-ui__thumb--checked'] : ''}`} />
      </div>

      {label && label}
    </label>
  );
};

export default SwitchUi;