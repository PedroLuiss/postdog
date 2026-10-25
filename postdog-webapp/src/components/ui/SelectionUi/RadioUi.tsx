import React from 'react';
import { Circle } from 'lucide-react';
import styles from './SelectionUi.module.scss';

interface RadioUiProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    className?: string;
}

const RadioUi: React.FC<RadioUiProps> = ({ label, className, ...props }) => {
    return (
        <label className={`
            ${styles.selection} 
            ${props.disabled ? styles['selection--disabled'] : ''} 
            ${className || ''}
        `}>
            <input 
                type="radio" 
                className={styles.selection__input} 
                {...props} 
            />
            <div className={`
                ${styles['selection__radio-control']} 
                ${props.checked ? styles['selection__radio-control--checked'] : ''}
            `}>
                {props.checked && (
                    <Circle className={styles['selection__radio-icon']} />
                )}
            </div>
            {label && <span className={styles.selection__label}>{label}</span>}
        </label>
    );
};

export default RadioUi;