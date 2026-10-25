import { Alert } from "../../../../types";

export interface GlobalAlertsTableProps {
  alerts: Alert[];
  onDelete?: (uid: string) => void;
  onEdit?: (uid: string) => void;
  onReschedule?: (uid: string) => void;
  onTogglePin?: (uid: string, isPinned: boolean) => Promise<void> | void;
  isFetchingMore?: boolean;
  hasMore?: boolean;
  loading?: boolean;
  observerTarget?: React.RefObject<HTMLDivElement>;
  isReadOnly?: boolean;
}