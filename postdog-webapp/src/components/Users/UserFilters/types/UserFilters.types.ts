
export interface UserFiltersProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    filters: any;
    onFilterChange: (name: string, value: any) => void;
    onClear: () => void;
    totalItems: number;
}

export interface Filters {
    verification: string;
    plan: string;
    role: string;
    status: string;
    dateType: string;
    startDate: string | null;
    endDate: string | null;
    [key: string]: any;
}
