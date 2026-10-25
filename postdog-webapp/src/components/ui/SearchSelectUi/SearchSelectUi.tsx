import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, ReactNode } from 'react';
import styles from './SearchSelectUi.module.scss';
import { ChevronDown, Check, X } from 'lucide-react';

export interface SearchOption {
  code: string;
  description: string;
}

interface SearchSelectUiProps {
  label?: React.ReactNode;
  placeholder?: string;
  options: SearchOption[];
  onSelect: (option: SearchOption) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  error?: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  containerClassName?: string;  
  showMessageError?: boolean;
  isLoading?: boolean;
}

const SearchSelectUi = forwardRef<HTMLInputElement, SearchSelectUiProps>(
  ({ label, placeholder, options, onSelect, containerClassName, onChange, error, name, defaultValue, value, showMessageError = true, isLoading = false }, ref) => {
    const [searchTerm, setSearchTerm] = useState(value ?? defaultValue ?? '');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (value !== undefined) {
            setSearchTerm(value);
            
            const codeFromValue = value.split(' - ')[0];
            const matchingOption = options.find(opt => opt.code === codeFromValue);
            if (matchingOption) {
                setSelectedCode(matchingOption.code);
            } else if (!value) {
                setSelectedCode(null);
            }
        }
    }, [value, options]);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => inputRef.current!);

    const filteredOptions = isTyping
      ? options.filter(
        (opt) =>
          opt.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opt.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      : options;

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setIsTyping(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option: SearchOption) => {
      setSearchTerm(`${option.code} - ${option.description}`);
      setSelectedCode(option.code);
      onSelect(option);
      setIsOpen(false);
      setIsTyping(false);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();

      setSearchTerm('');
      setSelectedCode(null);
      onSelect({ code: '', description: '' });

      setIsOpen(true);
      setIsTyping(false);
      if (inputRef.current) inputRef.current.focus();
    };

    const handleInputClick = () => {
      setIsOpen(true);
      setIsTyping(false);
    };

    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setIsTyping(true);
        if (!isOpen) setIsOpen(true);

        if (onChange) {
            onChange(e);
        }
    };

    return (
      <div className={`${styles['search-select']} ${containerClassName}`} ref={containerRef}>
        {label && <label className={styles['search-select__label']}>{label}</label>}

        <div className={styles['search-select__wrapper']}>
          <input
            ref={inputRef}
            type="text"
            name={name}
            className={`
                ${styles['search-select__input']} 
                ${error ? styles['search-select__input--error'] : ''}
            `}
            disabled={isLoading}
            placeholder={isLoading ? 'Cargando...' : placeholder}
            value={searchTerm}
            onChange={handleInternalChange}
            onClick={handleInputClick}
            onFocus={handleInputClick}
            autoComplete="off"
          />

          <div className={styles['search-select__controls']}>
            {searchTerm && (
              <button type="button" className={styles['search-select__clear-btn']} onClick={handleClear}>
                <X size={14} />
              </button>
            )}
            
            <div className={`${styles['search-select__arrow-icon']} ${isOpen ? styles['search-select__arrow-icon--open'] : ''}`} onClick={handleInputClick}>
              <ChevronDown size={16} />
            </div>
          </div>

          {isOpen && (
            <div className={styles['search-select__dropdown']}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.code === selectedCode;
                  return (
                    <button
                      key={opt.code}
                      type="button"
                      className={`${styles['search-select__option']} ${isSelected ? styles['search-select__option--selected'] : ''}`}
                      onClick={() => handleSelect(opt)}
                    >
                      <span>
                        <span className={styles['search-select__option-code']}>{opt.code}</span>
                        <span className={styles['search-select__option-description']}> - {opt.description}</span>
                      </span>
                      {isSelected && <Check size={16} className={styles['search-select__check-icon']} />}
                    </button>
                  );
                })
              ) : (
                <div className={styles['search-select__no-results']}>No se encontraron resultados</div>
              )}
            </div>
          )}
        </div>
        {error && showMessageError && <span className={styles['search-select__error-message']}>{error}</span>}
      </div>
    );
  }
);

SearchSelectUi.displayName = 'SearchSelectUi';

export default SearchSelectUi;