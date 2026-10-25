import { useState, useEffect, useRef, useCallback, ForwardedRef } from 'react';

interface UseImgUiProps {
  src: string | undefined;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  ref: ForwardedRef<HTMLImageElement>;
}

export const useImgUi = ({ src, onLoad, onError, ref }: UseImgUiProps) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(src ? 'loading' : 'error');
  const internalRef = useRef<HTMLImageElement | null>(null);

  const setRefs = useCallback((node: HTMLImageElement | null) => {
    internalRef.current = node;
    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }, [ref]);

  useEffect(() => {
    if (!src) {
      setStatus('error');
      return;
    }

    if (internalRef.current?.complete) {
      if (internalRef.current.naturalWidth > 0) {
        setStatus('loaded');
      } else {
        setStatus('error');
      }
    } else {
      setStatus('loading');
    }
  }, [src]);

  const handleLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setStatus('loaded');
    if (onLoad) onLoad(e);
  }, [onLoad]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setStatus('error');
    if (onError) onError(e);
  }, [onError]);

  return {
    status,
    setRefs,
    handleLoad,
    handleError
  };
};