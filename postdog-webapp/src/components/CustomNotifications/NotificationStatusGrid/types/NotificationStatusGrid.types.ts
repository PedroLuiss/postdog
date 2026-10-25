import { NotificationSettings } from "../../../../types";

export interface NotificationStatusGridProps {
    formData: NotificationSettings;
    handleToggleChange: (name: keyof NotificationSettings) => void;
    onSelectTemplate: (template: string) => void;
    selectedTemplate: string;
}