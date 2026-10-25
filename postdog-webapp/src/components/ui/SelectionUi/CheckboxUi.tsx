import React from 'react';
import { Check } from 'lucide-react';
import styles from './SelectionUi.module.scss';

interface CheckboxUiProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
}

const CheckboxUi: React.FC<CheckboxUiProps> = ({ label, className, ...props }) => {
    return (
        <label className={`
            ${styles.selection} 
            ${props.disabled ? styles['selection--disabled'] : ''} 
            ${className || ''}
        `}>
            <input 
                type="checkbox" 
                className={styles.selection__input} 
                {...props} 
            />
            <div className={`
                ${styles['selection__checkbox-control']} 
                ${props.checked ? styles['selection__checkbox-control--checked'] : ''}
            `}>
                {props.checked && <Check size={12} strokeWidth={4} />}
            </div>
            {label && <span className={styles.selection__label}>{label}</span>}
        </label>
    );
};

export default CheckboxUi;