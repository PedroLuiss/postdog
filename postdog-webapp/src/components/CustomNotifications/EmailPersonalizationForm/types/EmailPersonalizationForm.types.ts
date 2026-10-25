import { NotificationSettings } from "../../../../types";

export interface EmailPersonalizationFormProps {
    formData: NotificationSettings;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (file: File) => void;
    removeFile: () => void;
    logoFile: File | null;
}