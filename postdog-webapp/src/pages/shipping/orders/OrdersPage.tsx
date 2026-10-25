import styles from './OrdersPage.module.scss';
import { OrdersTable } from '../../../components/Orders/OrdersTable/OrdersTable';
import { OrdersSearchBar } from '../../../components/Orders/OrdersSearchBar/OrdersSearchBar';
import { useOrders } from '../../../hooks/useOrders';
import { FilterValues } from '../../../types';
import { NoOrdersState } from '../../../components/Orders/NoOrdersState/NoOrdersState';
import { OrdersNotFound } from '../../../components/Orders/OrdersNotFound/OrdersNotFound';
import { CreateShipmentDrawer } from '../../../components/CreateShipment/CreateShipmentDrawer';

const initialFilterValues: FilterValues = {
  searchTerm: '',
  startDate: '',
  endDate: '',
  statuses: [],
  stores: ['Todos'],
  integrations: [],
  dateRange: ['Todas'],
};

export const OrdersPage = () => {
  const {
    shipments,
    isSynced,
    isLoading,
    error,
    totalItems,
    filters,
    setFilters,
    refreshOrders,
    loadMore,
    hasMore,
    deleteOrder,
    handleConnectStore,
    handleSyncOrders,
    handleCreateManualOrder,
    handleShipOrder
  } = useOrders();

  const handleClearFilters = () => {
    setFilters(initialFilterValues);
  };

  const hasActiveFilters =
    filters.searchTerm !== '' ||
    filters.startDate !== '' ||
    filters.endDate !== '' ||
    filters.statuses.length > 0 ||
    filters.stores.length > 0 ||
    filters.integrations.length > 0;

  const showZeroState = !isLoading && !error && shipments.length === 0 && !hasActiveFilters;
  const showNotFoundState =
    (!isLoading && !error && shipments.length === 0 && hasActiveFilters) ||
    (!isLoading && error != null && error.includes('400'));

  return (
    <div className={styles['orders-page']}>
      {isSynced && !showNotFoundState && !showZeroState && (
        <OrdersSearchBar
          currentFilters={filters}
          totalOrders={totalItems}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          onRefresh={refreshOrders}
          onSearch={() => { }}
        />
      )}

      <div className={styles['content-area']}>
        {(!isSynced || showZeroState) ? (
          <NoOrdersState
            onConnectStore={handleConnectStore}
            onSyncOrders={handleSyncOrders}
            onCreateManualOrder={handleCreateManualOrder}
          />
        ) : (
          <>
            {showNotFoundState ? (
              <OrdersNotFound onResetSearch={handleClearFilters} />
            ) : (shipments.length > 0 || isLoading) ? (
              <OrdersTable
                isLoading={isLoading}
                error={showNotFoundState ? null : error}
                shipments={shipments}
                onDelete={deleteOrder}
                onEdit={handleShipOrder}
                onLoadMore={loadMore}
                hasMore={hasMore}
              />
            ) : null}
          </>
        )}
      </div>
      <CreateShipmentDrawer onSuccess={refreshOrders} />
    </div>
  );
};