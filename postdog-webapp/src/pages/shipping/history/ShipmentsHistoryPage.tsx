import styles from './ShipmentsHistoryPage.module.scss';
import { ShipmentFilter } from '../../../components/ShipmentsHistory/ShipmentFilter/ShipmentFilter';
import { ShipmentList } from '../../../components/ShipmentsHistory/ShipmentList/ShipmentList';
import { useShipmentsHistory } from '../../../hooks/useShipmentsHistory';
import { ImportShipmentsDrawer } from '../../../components/ShipmentsHistory/ImportShipmentsModalDrawer/ImportShipmentsDrawer';
import { DownloadGuidesModal } from '../../../components/ShipmentsHistory/DownloadGuidesModal/DownloadGuidesModal';
import { CreateShipmentDrawer } from '../../../components/CreateShipment/CreateShipmentDrawer';
import { ShipmentItemSkeleton } from '../../../components/ui/SkeletonUi/ShipmentItemSkeleton/ShipmentItemSkeleton';

export const ShipmentsHistoryPage = () => {
  const {
    shipments,
    totalItems,
    isLoading,
    isFetchingMore,
    searchTerm,
    setSearchTerm,
    selectedIds,
    toggleSelectAll,
    toggleSelectItem,
    isFilterOpen,
    filters,
    setFilters,
    toggleFilter,
    closeFilter,
    clearFilters,
    clearAll,
    isDownloadModalOpen,
    setIsDownloadModalOpen,
    isImportOpen,
    setIsImportOpen,
    observerTarget,
    refresh
  } = useShipmentsHistory();


  return (
    <div className={styles['history-page']}>

      <ShipmentFilter
        loadedCount={shipments.length}
        totalItems={totalItems}
        selectedCount={selectedIds.length}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        isFilterOpen={isFilterOpen}
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={clearFilters}
        onDownload={() => setIsDownloadModalOpen(true)}
        onImport={() => setIsImportOpen(true)}
        onFilterToggle={toggleFilter}
        onFilterClose={closeFilter}
        onSelectAll={toggleSelectAll}
        isAllSelected={selectedIds.length === shipments.length && shipments.length > 0}
      />

      {isLoading ? (
          [...Array(5)].map((_, i) => <ShipmentItemSkeleton key={i} />)
      ) : (
        <>
          <ShipmentList
            data={shipments}
            selectedIds={selectedIds}
            onSelectItem={toggleSelectItem}
            onClearFilters={clearAll}
            onRefresh={refresh}
          />
          
          <div ref={observerTarget} style={{ position: 'relative', height: '100px'}}>
              {isFetchingMore && [...Array(3)].map((_, i) => <ShipmentItemSkeleton key={i} />)}
          </div>
        </>
      )}

      <ImportShipmentsDrawer isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />

      <DownloadGuidesModal 
        isOpen={isDownloadModalOpen} 
        onClose={() => setIsDownloadModalOpen(false)} 
        selectedIds={selectedIds} 
      />

      <CreateShipmentDrawer onSuccess={refresh} />
    </div>
  );
};