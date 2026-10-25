import { ReactNode } from 'react';

export interface DrawerModalUiProps {
    isOpen: boolean;
    onClose: () => void;
    title?: ReactNode;
    headerNode?: ReactNode;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: string;
    maxWidthLg?: string;
    className?: string;
    showCloseButton?: boolean;
    anchor?: 'left' | 'right' | 'top' | 'bottom';
    headerActions?: ReactNode;
}
