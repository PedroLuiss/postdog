import { ReactNode, ChangeEvent, KeyboardEvent } from 'react';

export interface FilterSearchProps {
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
    className?: string;
    style?: React.CSSProperties;
    iconSize?: number;
}

export interface FilterUiProps {
    children: ReactNode;
    className?: string;
}

export interface FilterOptionsProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface FilterActionsProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export interface FilterTagProps {
    children: ReactNode;
    className?: string;
    variant?: 'demo' | 'default';
    style?: React.CSSProperties;
}

export interface FilterModalUiProps {
    children: ReactNode;
    title?: string;
    onClear?: () => void;
    showClear?: boolean;
    className?: string;
    headerClassName?: string;
    titleClassName?: string;
    contentClassName?: string;
    clearButtonClassName?: string;
    style?: React.CSSProperties;
    onClose?: () => void;
}
