import { UserUI } from "../../../../types";

export interface UserTableProps {
    users: UserUI[];
    selectedUserIds: string[];
    onToggleSelect: (uid: string) => void;
    onSelectAll: (selected: boolean) => void;
    onAction: (action: string, user: any) => void;
    isFetchingMore: boolean;
    onLoadMore: () => void;
    hasMore: boolean;
    isVendor: boolean;
    loading: boolean;
    sortBy: string;
    sortOrder: 'ASC' | 'DESC';
    onSort: (field: string) => void;
}

export interface UseUserTableProps {
    users: UserUI[];
    selectedUserIds: string[];
    onToggleSelect: (uid: string) => void;
    onAction: (action: string, user: UserUI) => void;
    isVendor: boolean;
    hasMore: boolean;
    isFetchingMore: boolean;
    onLoadMore: () => void;
}