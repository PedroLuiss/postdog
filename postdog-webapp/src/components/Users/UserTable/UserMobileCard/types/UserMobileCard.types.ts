export interface UserMobileCardProps {
    user: any;
    isSelected: boolean;
    onToggleSelect: (uid: string) => void;
    onAction: (action: string, user: any) => void;
    isVendor: boolean;
}