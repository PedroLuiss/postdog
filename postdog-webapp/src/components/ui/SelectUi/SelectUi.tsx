import React, { useState, useRef, useEffect, forwardRef } from 'react';
import styles from './SelectUi.module.scss';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  value: string | number;
  label: React.ReactNode | string;
}

interface SelectUiProps {
  label?: React.ReactNode | string;
  error?: string;
  icon?: React.ReactNode;
  options: Option[];
  placeholder?: string;
  value?: string | number;
  onChange?: (e: { target: { name: string, value: string | number } }) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  containerClassName?: string;
  showMessageError?: boolean;
}

const SelectUi = forwardRef<HTMLDivElement, SelectUiProps>(
  ({ label, error, icon, options, placeholder, value, onChange, name = "", disabled, className, containerClassName, showMessageError = true }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: Option) => {
      if (disabled) return;
      if (onChange) {
        onChange({ target: { name, value: option.value } });
      }
      setIsOpen(false);
    };

    const selectedOption = options?.find?.(opt => opt.value === value);

    return (
      <div className={`${styles['select-field']} ${containerClassName || ''}`} ref={containerRef}>
        {label && <label className={styles['select-field__label']}>{label}</label>}

        <div className={styles['select-field__container']}>
          {icon && <div className={styles['select-field__external-icon']}>{icon}</div>}

          <div className={styles['select-field__wrapper']}>
            <button
              type="button"
              className={`
                ${styles['select-field__trigger']} 
                ${isOpen ? styles['select-field__trigger--open'] : ''} 
                ${error ? styles['select-field__trigger--error'] : ''} 
                ${disabled ? styles['select-field__trigger--disabled'] : ''}
                ${className}
              `}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
            >
              <span className={!selectedOption ? styles['select-field__placeholder'] : ''}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronDown
                size={16}
                className={`
                  ${styles['select-field__arrow']} 
                  ${isOpen ? styles['select-field__arrow--open'] : ''}
                  ${selectedOption ? styles['select-field__arrow--selected'] : ''}
                `}
              />
            </button>

            {isOpen && options && (
              <div className={styles['select-field__menu']}>
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`
                        ${styles['select-field__option']} 
                        ${isSelected ? styles['select-field__option--selected'] : ''}
                      `}
                      onClick={() => handleSelect(opt)}
                    >
                      <span>{opt.label}</span>
                      {isSelected && <Check size={14} className={styles['select-field__check']} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {error && showMessageError && <span className={styles['select-field__error-message']}>{error}</span>}
      </div>
    );
  }
);

SelectUi.displayName = 'SelectUi';

export default SelectUi;