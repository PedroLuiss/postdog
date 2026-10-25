import { useState, useEffect, ChangeEvent, FocusEvent } from 'react';

interface UseInputNumberUiProps {
    value?: string | number | readonly string[];
    defaultValue?: string | number | readonly string[];
    onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useInputNumberUi = ({
    value,
    defaultValue,
    onFocus,
    onBlur,
    onChange,
}: UseInputNumberUiProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(value || defaultValue || "");

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        if (onFocus) onFocus(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const handleInternalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Solo permitir números
        if (newValue === '' || /^\d*$/.test(newValue)) {
            setInternalValue(newValue);
            if (onChange) onChange(e);
        }
    };

    return {
        isFocused,
        internalValue,
        handleFocus,
        handleBlur,
        handleInternalChange,
    };
};
