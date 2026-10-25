import React from 'react';
import styles from '../../assets/styles/components/ui/Select.module.scss';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import { SelectProps } from '../../types/select.type';
import { useSelect } from '../../hooks/useSelect';

export const Select: React.FC<SelectProps> = ({
    value,
    onChange,
    options,
    className = '',
    placeholder = 'Select...'
}) => {
    const {
        isOpen,
        setIsOpen,
        containerRef,
        handleSelect,
        normalizedOptions
    } = useSelect(options);

    const selectedOption = normalizedOptions.find(opt => opt.value === value);

    return (
        <div
            className={`${styles.select} ${className}`}
            ref={containerRef}
        >
            <div
                className={`${styles['select__trigger']} ${isOpen ? styles['select__trigger--open'] : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedOption ? selectedOption.label : placeholder}</span>
                <span className={`${styles['select__icon']} ${isOpen ? styles['select__icon--open'] : ''}`}>
                    <KeyboardArrowDownIcon />
                </span>
            </div>

            {isOpen && (
                <div className={styles['select__dropdown']}>
                    {normalizedOptions.map((option) => (
                        <div
                            key={option.value}
                            className={`${styles['select__option']} ${option.value === value ? styles['select__option--selected'] : ''}`}
                            onClick={() => handleSelect(option.value, onChange)}
                        >
                            {option.label}
                            {option.value === value && (
                                <span className={styles['select__check']}>
                                    <CheckIcon fontSize="inherit" />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
