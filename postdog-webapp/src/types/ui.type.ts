import { ReactNode } from 'react';
import { AlertProps } from '@mui/material/Alert';

export interface Option {
    value: string | number;
    label: string;
    icon?: ReactNode;
}

export interface SelectUiProps {
    label?: ReactNode;
    error?: string;
    icon?: ReactNode;
    options: Option[];
    placeholder?: string;
    value?: string | number;
    onChange?: (event: { target: { name?: string; value: string | number } }) => void;
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
    name?: string;
    disabled?: boolean;
    className?: string;
}

export interface InputUiProps {
    label?: ReactNode;
    error?: string;
    icon?: ReactNode;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    name?: string;
    disabled?: boolean;
    className?: string;
    type?: string;
    prefix?: string;
    suffix?: ReactNode;
}

export interface AlertSnackbarProps {
    open: boolean;
    title: string;
    description?: string;
    onClose: () => void;
    severity?: AlertProps['severity'];
    autoHideDuration?: number;
    anchorOrigin?: { vertical: 'top' | 'bottom', horizontal: 'center' | 'left' | 'right' }
}
