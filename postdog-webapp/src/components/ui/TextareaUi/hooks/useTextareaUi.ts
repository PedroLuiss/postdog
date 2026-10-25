import { useState, useCallback, useMemo } from 'react';

interface UseTextareaUiProps {
  value?: string | number | readonly string[];
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  error?: string;
  showBadge?: boolean;
  isValid?: boolean;
  showCountString?: boolean;
}

export const useTextareaUi = ({ value, onChange, error, showBadge, isValid, showCountString }: UseTextareaUiProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const currentLength = String(value || '').length;

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const canShowIndicators = useMemo(() => {
    return showCountString || error || showBadge;
  }, [showCountString, error, showBadge]);

  const showErrorBadge = useMemo(() => {
    return !!error;
  }, [error]);

  const showSuccessBadge = useMemo(() => {
    if (showErrorBadge) return false;
    return !!showBadge && !!isValid;
  }, [showErrorBadge, showBadge, isValid]);

  return {
    isFocused,
    currentLength,
    canShowIndicators,
    showErrorBadge,
    showSuccessBadge,
    handleFocus,
    handleBlur,
  };
};