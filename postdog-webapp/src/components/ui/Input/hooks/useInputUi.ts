import { useState, useEffect, ChangeEvent, FocusEvent } from 'react';

interface UseInputUiProps {
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  maxLength?: number;
  error?: string;
  isValidCircle?: (value: string) => boolean;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  showCountString?: boolean;
  showBadge?: boolean;
  isValid?: boolean;
  isInteger?: boolean;
}

export const useInputUi = ({
  value,
  defaultValue,
  maxLength,
  error,
  isValidCircle,
  onFocus,
  onBlur,
  onChange,
  showCountString,
  showBadge,
  isValid,
  isInteger,
}: UseInputUiProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || defaultValue || "");

  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value, internalValue]);

  const currentLength = String(internalValue).length;

  const isInternalValueValid = isValidCircle
    ? isValidCircle(String(internalValue))
    : maxLength
    ? currentLength === maxLength
    : true;

  const isActuallyError = isValid !== undefined ? !isValid : (!!error || !isInternalValueValid);

  const canShowIndicators = (showCountString || isValidCircle || showBadge);
  const shouldDisplayBadge = !isFocused && (showBadge !== undefined ? showBadge : currentLength > 0);

  const showErrorBadge = shouldDisplayBadge && isActuallyError;
  const showSuccessBadge = shouldDisplayBadge && !isActuallyError;

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const handleInternalChange = (e: ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    if (isInteger) {
      newValue = newValue.replace(/[^0-9]/g, '');
    }

    if (maxLength && newValue.length > maxLength) return;
    setInternalValue(newValue);
    if (onChange) onChange(e);
  };

  return {
    internalValue,
    currentLength,
    canShowIndicators,
    showErrorBadge,
    showSuccessBadge,
    handleFocus,
    handleBlur,
    handleInternalChange,
  };
};