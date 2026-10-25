import React from 'react';
import { ChevronDown, Check, X, Info } from 'lucide-react';
import styles from './SATProductSelect.module.scss';
import { CustomTooltipUi } from '../CustomTooltipUi';
import { useSATProductSelect } from './hooks/useSATProductSelect';

interface SATProductSelectProps {
  value: string; 
  onSelect: (opt: { code: string; description: string }) => void;
  error?: string;
  label?: string;
  required?: boolean;
  isInfo?: boolean;
  showMessageError?: boolean;
  className?: string;
  placeholder?: string;
  messageTooltip?: string;
}

export const SATProductSelect: React.FC<SATProductSelectProps> = ({
  value,
  onSelect,
  error,
  label = "Tipo de producto",
  placeholder = "Busca por palabra clave o número de producto",
  required = true,
  isInfo = true,
  showMessageError = true,
  className,
  messageTooltip = "El SAT requiere el uso del complemento Carta Porte como requisito legal para poder realizar tu envío."
}) => {
  
  const {
    searchTerm,
    isOpen,
    containerRef,
    options,
    loading,
    handleInputChange,
    handleFocus,
    handleSelectOption,
    handleClear
  } = useSATProductSelect({ value, onSelect });

  return (
    <div className={`${styles['sat-select']} ${className || ''}`} ref={containerRef}>
      {label && (
        <label className={styles['sat-select__label']}>
          <div className={styles['sat-select__label-wrapper']}>
            <label className={styles['sat-select__label-info']}>
              {label}{required && '*'}
            </label>
            {isInfo && (
              <CustomTooltipUi 
                variant="red" 
                title={messageTooltip}
                className={styles['sat-select__info-tooltip']}
              >
                <button type="button" className={styles['sat-select__info-icon']}>
                  <Info size={14} />
                </button>
              </CustomTooltipUi>
            )}
          </div>
        </label>
      )}

      <div className={styles['sat-select__wrapper']}>
        <input
          type="text"
          className={`
            ${styles['sat-select__input']} 
            ${error ? styles['sat-select__input--error'] : ''}
          `}
          placeholder={loading ? 'Cargando...' : placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          autoComplete="off"
        />

        <div className={styles['sat-select__controls']}>
          {searchTerm && (
            <button type="button" className={styles['sat-select__clear-btn']} onClick={handleClear}>
              <X size={14} />
            </button>
          )}
          <div className={`
            ${styles['sat-select__arrow']} 
            ${isOpen ? styles['sat-select__arrow--open'] : ''}
          `}>
            <ChevronDown size={16} />
          </div>
        </div>

        {isOpen && (
          <div className={styles['sat-select__dropdown']}>
            {loading ? (
              <div className={styles['sat-select__loading']}>Cargando productos...</div>
            ) : options.length > 0 ? (
              options.map((opt) => {
                const isSelected = value?.startsWith(opt.code);
                return (
                  <button
                    key={opt.code}
                    type="button"
                    className={`
                      ${styles['sat-select__option']} 
                      ${isSelected ? styles['sat-select__option--selected'] : ''}
                    `}
                    onClick={() => handleSelectOption(opt)}
                  >
                    <span>
                      <span className={styles['sat-select__option-code']}>{opt.code}</span>
                      <span className={styles['sat-select__option-desc']}> - {opt.description}</span>
                    </span>
                    {isSelected && <Check size={16} className={styles['sat-select__check']} />}
                  </button>
                );
              })
            ) : (
              <div className={styles['sat-select__no-results']}>No se encontraron resultados</div>
            )}
          </div>
        )}
      </div>
      {error && showMessageError && <span className={styles['sat-select__error']}>{error}</span>}
    </div>
  );
};