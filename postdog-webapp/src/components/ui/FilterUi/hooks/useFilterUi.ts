import { useState, ChangeEvent, KeyboardEvent } from 'react';

interface UseFilterUiProps {
    onSearch?: (term: string) => void;
    initialValue?: string;
}

export const useFilterUi = ({ onSearch, initialValue = '' }: UseFilterUiProps = {}) => {
    const [searchTerm, setSearchTerm] = useState(initialValue);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(searchTerm);
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        handleSearchChange,
        handleKeyDown
    };
};
