export interface ShipmentFilterProps {
    loadedCount: number;
    totalItems: number;
    selectedCount: number;
    onSearch: (value: string) => void;
    searchTerm: string;
    isFilterOpen: boolean;
    onFilterToggle: () => void;
    onFilterClose: () => void;
    onSelectAll: () => void;
    isAllSelected: boolean;
    onDownload: () => void;
    onImport: () => void;
    filters: any;
    onFilterChange: (filters: any) => void;
    onClearFilters: () => void;
}