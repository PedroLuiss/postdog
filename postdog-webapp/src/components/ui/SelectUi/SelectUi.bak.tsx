import React, { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import styles from './SelectUi.module.scss';
import { ChevronDown } from 'lucide-react';

export interface Option {
    value: string | number;
    label: string;
}

interface SelectUiProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: ReactNode;
    error?: string;
    icon?: ReactNode;
    options: Option[];
    placeholder?: string;
    showSearch?: boolean;
}

const SelectUi = forwardRef<HTMLSelectElement, SelectUiProps>(
    ({ label, error, icon, options, placeholder, showSearch, className, ...props }, ref) => {

        return (
            <div className={styles['select-field']}>
                {label && <label className={styles['select-field__label']}>{label}</label>}

                <div className={styles['select-field__container']}>
                    {icon && <div className={styles['select-field__external-icon']}>{icon}</div>}

                    <div className={styles['select-field__wrapper']}>
                        <select
                            ref={ref}
                            className={`
                ${styles['select-field__select']} 
                ${error ? styles['select-field__select--error'] : ''} 
                ${showSearch ? styles['select-field__select--searchable'] : ''}
                ${className}
              `}
                            {...props}
                        >
                            {placeholder && <option value="" hidden disabled>{placeholder}</option>}
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <div className={styles['select-field__arrow']}>
                            <ChevronDown size={16} />
                        </div>
                    </div>
                </div>

                {error && <span className={styles['select-field__error-message']}>{error}</span>}
            </div>
        );
    }
);

SelectUi.displayName = 'SelectUi';

export default SelectUi;
