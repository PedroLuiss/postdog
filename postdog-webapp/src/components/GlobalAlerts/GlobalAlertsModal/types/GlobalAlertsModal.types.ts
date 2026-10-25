import { Alert, GlobalAlertCreateRequest } from "../../../../types/globalAlerts.type";

export interface GlobalAlertsModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Alert | null;
    onSubmit: (data: GlobalAlertCreateRequest) => Promise<void>;
}