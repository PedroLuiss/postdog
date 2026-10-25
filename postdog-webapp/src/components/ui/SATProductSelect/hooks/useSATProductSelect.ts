import { useState, useRef, useEffect } from 'react';
import { useSATProducts } from '../../../../hooks/useSATProducts';

interface UseSATProductSelectProps {
  value: string;
  onSelect: (opt: { code: string; description: string }) => void;
}

export const useSATProductSelect = ({ value, onSelect }: UseSATProductSelectProps) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { options, loading, searchProducts, clearOptions } = useSATProducts();

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm(value || '');
    }
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm(value || '');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (isOpen && searchTerm && !searchTerm.includes(' - ')) {
        searchProducts(searchTerm);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchProducts, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) setIsOpen(true);
  };

  const handleFocus = () => {
    setIsOpen(true);
    setSearchTerm(''); 
    searchProducts(); 
  };

  const handleSelectOption = (opt: { code: string; description: string }) => {
    const displayValue = `${opt.code} - ${opt.description}`;
    setSearchTerm(displayValue);
    onSelect(opt);
    setIsOpen(false);
    clearOptions();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    onSelect({ code: '', description: '' });
    clearOptions();
    searchProducts();
    setIsOpen(true);
  };

  return {
    searchTerm,
    isOpen,
    containerRef,
    options,
    loading,
    handleInputChange,
    handleFocus,
    handleSelectOption,
    handleClear,
    setIsOpen
  };
};