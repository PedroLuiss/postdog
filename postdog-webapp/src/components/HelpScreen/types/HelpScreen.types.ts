export interface HelpTopic {
    value: string;
    label: string;
}

export interface HelpFormState {
    topic: string;
    description: string;
}

export interface UseHelpScreenReturn {
    formState: HelpFormState;
    isSubmitting: boolean;
    handleTopicChange: (value: string) => void;
    handleDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleSubmit: () => void;
    handleWhatsApp: () => void;
    HELP_TOPICS: HelpTopic[];
}
