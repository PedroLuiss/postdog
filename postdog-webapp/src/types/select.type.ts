import { Dispatch, SetStateAction, RefObject } from 'react';

export interface SelectOption {
    label: string | number;
    value: string | number;
}

export interface SelectProps {
    value: string | number;
    onChange: (value: any) => void;
    options: SelectOption[] | number[] | string[];
    className?: string;
    placeholder?: string;
}

export interface UseSelectReturn {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    containerRef: RefObject<HTMLDivElement | null>;
    handleSelect: (optionValue: string | number, onChange: (value: any) => void) => void;
    normalizedOptions: SelectOption[];
}
