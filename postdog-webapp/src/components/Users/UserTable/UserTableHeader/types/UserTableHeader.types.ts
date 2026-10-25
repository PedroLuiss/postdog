export interface UserTableHeaderProps {
    onSelectAll: (selected: boolean) => void;
    isSelectedAll: boolean;
    onSort: (field: string) => void;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    isVendor?: boolean;
}