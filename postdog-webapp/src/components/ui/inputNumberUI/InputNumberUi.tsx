import React, { forwardRef } from 'react';
import styles from './InputNumberUi.module.scss';
import { useInputNumberUi } from './hooks/useInputNumberUi';

interface InputNumberUiProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'onChange'> {
    label?: React.ReactNode;
    error?: string;
    onIncrement?: () => void;
    onDecrement?: () => void;
    containerClassName?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputNumberUi = forwardRef<HTMLInputElement, InputNumberUiProps>((props, ref) => {
    const {
        label,
        error,
        onIncrement,
        onDecrement,
        className,
        containerClassName,
        onChange,
        ...rest
    } = props;

    const {
        internalValue,
        handleFocus,
        handleBlur,
        handleInternalChange,
    } = useInputNumberUi(props as any);

    return (
        <div className={`${styles.field} ${containerClassName || ''}`}>
            {label && <label className={styles.field__label}>{label}</label>}

            <div className={styles.field__container}>
                <div className={styles['field__input-wrapper']}>
                    <input
                        ref={ref}
                        type="text"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleInternalChange}
                        className={`
              ${styles.field__input} 
              ${error ? styles['field__input--error'] : ''} 
              ${className || ''}
            `}
                        {...rest}
                        value={props.value !== undefined ? props.value : internalValue}
                    />

                    <div className={styles['field__arrows']}>
                        <button
                            type="button"
                            tabIndex={-1}
                            className={styles['field__arrow-btn']}
                            onClick={onIncrement}
                        >
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor">
                                <path d="M4 0L8 6H0L4 0Z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            tabIndex={-1}
                            className={styles['field__arrow-btn']}
                            onClick={onDecrement}
                        >
                            <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor">
                                <path d="M4 6L0 0H8L4 6Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {error && <span className={styles['field__error-message']}>{error}</span>}
        </div>
    );
});

InputNumberUi.displayName = 'InputNumberUi';

export default InputNumberUi;
