export interface BulkActionsBarProps {
    selectedCount: number;
    onAction: (action: string) => void;
    onCancel: () => void;
}