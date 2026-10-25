import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react';
import { OrdersSearchBarProps } from '../types';

type UseOrdersSearchBarProps = Pick<OrdersSearchBarProps, 'currentFilters' | 'onFiltersChange' | 'onSearch'>;

export const useOrdersSearchBar = ({
    currentFilters,
    onFiltersChange,
    onSearch
}: UseOrdersSearchBarProps) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
    const filterButtonRef = useRef<HTMLButtonElement>(null);

    const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...currentFilters, searchTerm: e.target.value });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const closeFilter = (e?: any) => {
        if (filterButtonRef.current?.contains(e?.target as Node)) return;
        setIsFilterOpen(false);
    };

    const openOrdersModal = () => {
        setIsOrdersModalOpen(true);
    };

    const closeOrdersModal = () => {
        setIsOrdersModalOpen(false);
    };

    return {
        isFilterOpen,
        isOrdersModalOpen,
        filterButtonRef,
        handleSearchInputChange,
        handleKeyDown,
        toggleFilter,
        closeFilter,
        openOrdersModal,
        closeOrdersModal
    };
};
