import { UserUI } from "../../../../../types";

export interface UserTableRowProps {
    user: UserUI;
    isSelected: boolean;
    onToggleSelect: (uid: string) => void;
    onAction: (action: string, user: UserUI) => void;
    isVendor: boolean;
    onlyOptions?: boolean;
}