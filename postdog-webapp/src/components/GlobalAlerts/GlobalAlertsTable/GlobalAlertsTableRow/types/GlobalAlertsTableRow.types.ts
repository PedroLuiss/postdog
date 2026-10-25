import { Alert } from "../../../../../types";

export interface GlobalAlertsTableRowProps {
  alert: Alert;
  onDelete?: (uid: string) => void;
  onEdit?: (uid: string) => void;
  onReschedule?: (uid: string) => void;
  onTogglePin?: (uid: string, isPinned: boolean) => Promise<void> | void;
  isReadOnly?: boolean;
}