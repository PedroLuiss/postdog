import { useState } from 'react';
import { HelpFormState, HelpTopic, UseHelpScreenReturn } from '../types/HelpScreen.types';

const HELP_TOPICS: HelpTopic[] = [
    { value: 'tecnicos', label: 'Problemas técnicos' },
    { value: 'envios', label: 'Información sobre envíos' },
    { value: 'facturacion', label: 'Facturación' },
    { value: 'integraciones', label: 'Integraciones' },
    { value: 'otro', label: 'Otro' },
];

const WHATSAPP_NUMBER = '525500000000';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const useHelpScreen = (): UseHelpScreenReturn => {
    const [formState, setFormState] = useState<HelpFormState>({
        topic: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTopicChange = (value: string) => {
        setFormState((prev) => ({ ...prev, topic: value }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormState((prev) => ({ ...prev, description: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!formState.topic || !formState.description.trim()) return;

        setIsSubmitting(true);
        try {
            // TODO: integrate with support API
            console.log('Submitting help request:', formState);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWhatsApp = () => {
        window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
    };

    return {
        formState,
        isSubmitting,
        handleTopicChange,
        handleDescriptionChange,
        handleSubmit,
        handleWhatsApp,
        HELP_TOPICS,
    };
};
