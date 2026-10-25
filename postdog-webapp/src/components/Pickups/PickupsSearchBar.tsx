import React from 'react';
import styles from './PickupsSearchBar.module.scss';
import { FunnelIcon, RefreshIcon, SearchIcon } from '../icons';
import { FilterModal } from '../Orders/FilterModal/FilterModal';
import { PickupsSearchBarProps } from '../../types/pickups.type';

export const PickupsSearchBar: React.FC<PickupsSearchBarProps> = ({
  currentFilters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  onRefresh,
  onSearch,
  isFilterOpen,
  setIsFilterOpen
}) => {
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...currentFilters, searchTerm: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className={styles['pickup-filter']}>
      <div className={styles['pickup-filter__main-controls']}>
        <div className={styles['pickup-filter__search-wrapper']}>
          <input
            type="text"
            className={styles['pickup-filter__input']}
            placeholder="Escribe número de orden o destinatario"
            value={currentFilters.searchTerm || ''}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          className={`${styles['pickup-filter__button']} ${styles['pickup-filter__button--search']}`}
          onClick={onSearch}
        >
          <SearchIcon
            className={`${styles['pickup-filter__icon']}`}
            width={20}
            height={20}
            strokeColor="white"
          />
        </button>

        <div className={styles['pickup-filter__filter-container']}>
          <button
            className={`${styles['pickup-filter__button']} ${styles['pickup-filter__button--secondary']}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FunnelIcon className={`${styles['pickup-filter__icon']}`} />
            <span className={styles['pickup-filter__button-text']}>Filtrar</span>
          </button>

          {isFilterOpen && (
            <FilterModal
              currentFilters={currentFilters}
              onChange={onFiltersChange}
              onClose={() => setIsFilterOpen(false)}
            />
          )}
        </div>
      </div>

      <div className={styles['pickup-filter__actions']}>

        <button
          className={`${styles['pickup-filter__button']} ${styles['pickup-filter__button--update']}`}
          onClick={onRefresh}
        >
          <RefreshIcon /> Actualizar
        </button>
      </div>
    </div>
  );
};