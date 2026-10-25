import { useState, useRef, useEffect, useMemo } from 'react';
import { SelectOption, UseSelectReturn } from "../types/select.type";

export const useSelect = (options: SelectOption[] | number[] | string[]): UseSelectReturn => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const normalizedOptions: SelectOption[] = useMemo(() => {
        return options.map(option => {
            if (typeof option === 'object' && option !== null && 'value' in option) {
                return option as SelectOption;
            }
            return { label: option, value: option };
        });
    }, [options]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue: string | number, onChange: (value: any) => void) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return {
        isOpen,
        setIsOpen,
        containerRef,
        handleSelect,
        normalizedOptions
    };
};
