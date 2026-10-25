import React from 'react';

// Styles
import styles from './OrdersSearchBar.module.scss';

// Icons
import { FunnelIcon, InfoIcon, RefreshIcon, SearchIcon } from '../../icons';
import { UploadFileIcon } from '../../icons/UploadFileIcon';

// Components
import { FilterModal } from '../FilterModal/FilterModal';
import { OrdersModal } from '../OrdersModal/OrdersModal';
import { FilterUi } from '../../ui/FilterUi/FilterUi';
import { CustomTooltipUi } from '../../ui/CustomTooltipUi';

// Hooks
import { useOrdersSearchBar } from '../../../hooks/useOrdersSearchBar';

// Types
import { OrdersSearchBarProps } from '../../../types';

export const OrdersSearchBar: React.FC<OrdersSearchBarProps> = ({
  currentFilters,
  totalOrders,
  onFiltersChange,
  onRefresh,
  onSearch
}) => {
  const {
    isFilterOpen,
    isOrdersModalOpen,
    filterButtonRef,
    handleSearchInputChange,
    handleKeyDown,
    toggleFilter,
    closeFilter,
    openOrdersModal,
    closeOrdersModal
  } = useOrdersSearchBar({ currentFilters, onFiltersChange, onSearch });

  return (
    <div className={styles['order-filter']}>
      <FilterUi className={styles['order-filter__main']}>
        <div className={styles['order-filter__search-container']}>
          <FilterUi.Search
            value={currentFilters.searchTerm || ''}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por número de orden o cliente"
            className={styles['order-filter__search']}
            iconSize={20}
          />
        </div>

        <FilterUi.Actions className={styles['order-filter__filter-action']}>
          <div className={styles['order-filter__filter-container']}>
            <button
              ref={filterButtonRef}
              className={`${styles['order-filter__button']} ${styles['order-filter__button--filter']}`}
              onClick={toggleFilter}
            >
              <FunnelIcon className={styles['icon-filter']} />
              <span className={styles['order-filter__button-text']}>Filtrar</span>
              {(() => {
                const activeCount = (currentFilters.stores?.length > 0 && !currentFilters.stores.includes('Todos') ? 1 : 0) +
                  (currentFilters.dateRange && currentFilters.dateRange.length > 0 && currentFilters.dateRange[0] !== 'Todas' ? 1 : 0);
                return activeCount > 0 ? (
                  <span className={styles['order-filter__badge']}>{activeCount}</span>
                ) : null;
              })()}
            </button>

            {isFilterOpen && (
              <FilterModal
                currentFilters={currentFilters}
                onChange={onFiltersChange}
                onClose={closeFilter}
              />
            )}
          </div>
        </FilterUi.Actions>
      </FilterUi>

      <div className={styles['order-filter__bottom-row']}>
        <div className={styles['order-filter__info-section']}>
          <CustomTooltipUi
            variant="red"
            title={
              <div className={styles['order-filter__tooltip-content']}>
                <p>Las órdenes sincronizadas muestran únicamente aquellas que se encuentran pendientes de preparación. Las órdenes canceladas por el cliente no se incluirán en este listado. </p>
                <p>Las órdenes en proceso se conservarán visibles durante un período de 60 días. Una vez transcurrido este plazo, se eliminarán automáticamente del sistema.</p>
              </div>
            }
          >
            <div className={styles['order-filter__icon-container']}>
              <InfoIcon className={styles['order-filter__info-icon']} />
            </div>
          </CustomTooltipUi>
          <span className={styles['order-filter__info-text']}>{totalOrders} {totalOrders === 1 ? 'orden' : 'órdenes'}</span>
        </div>

        <div className={styles['order-filter__actions-group']}>
          <button
            className={`${styles['order-filter__button']} ${styles['order-filter__button--secondary']}`}
            onClick={openOrdersModal}
          >
            <UploadFileIcon className={styles['icon-upload']} />
            <span>Subir órdenes</span>
          </button>
          <button
            className={`${styles['order-filter__button']} ${styles['order-filter__button--sync']}`}
            onClick={onRefresh}
          >
            <RefreshIcon />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={closeOrdersModal}
      />
    </div>
  );
};