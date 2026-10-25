import { NotificationSettings } from "../../../../types";

export interface NotificationPreviewProps {
    formData: NotificationSettings;
    previewUrl: string;
    previewHtml: string;
    loading: boolean;
}