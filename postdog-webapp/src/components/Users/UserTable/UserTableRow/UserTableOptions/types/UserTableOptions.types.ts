import { UserUI } from '../../../../../../types';

export interface UserTableOptionsProps {
    user: UserUI;
    isInactive: boolean;
    isVendor: boolean;
    onAction: (action: string, user: UserUI) => void;
    className?: string;
}