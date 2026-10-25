import { useState, useEffect, useCallback } from 'react';
import { NotificationSettingsService } from '../../../../services/notificationSettingsService';
import { NotificationSettings } from '../../../../types/notificationSettings.type';
import { getContrastColor } from '../../../../utils/colorUtils';

export const useNotificationSettings = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<NotificationSettings>({
        storeName: '',
        logoUrl: '',
        primaryColor: '#000000',
        secondaryColor: '#DC2626',
        enabledCreated: true,
        enabledShipped: true,
        enabledDelivered: true,
        enabledCanceled: true,
        storeUrl: '',
        supportPhone: '',
        supportEmail: '',
        buttonTextColor: '#FFFFFF'
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [previewHtml, setPreviewHtml] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string>('shipment-created');
    const [previewLoading, setPreviewLoading] = useState(false);
    const [alert, setAlert] = useState<{ open: boolean; title: string; severity: 'success' | 'error' }>({
        open: false,
        title: '',
        severity: 'success'
    });

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const data = await NotificationSettingsService.getSettings();
            setFormData(prev => ({ ...prev, ...data }));
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMailPreview = useCallback(async (templateName: string) => {
        setSelectedTemplate(templateName);
        setPreviewLoading(true);
        try {
            const html = await NotificationSettingsService.getMailPreview(templateName);
            setPreviewHtml(html);
        } catch (error) {
            console.error('Error fetching mail preview:', error);
            setPreviewHtml(null);
        } finally {
            setPreviewLoading(false);
        }
    }, []);

    const ensureHash = (color: string) => {
        if (!color) return color;
        return color.startsWith('#') ? color : `#${color}`;
    };

    const updateSettings = async () => {
        setLoading(true);
        try {
            const dataToUpload = new FormData();
            
            dataToUpload.append('storeName', formData.storeName || '');
            dataToUpload.append('primaryColor', ensureHash(formData.primaryColor));
            dataToUpload.append('secondaryColor', ensureHash(formData.secondaryColor));
            dataToUpload.append('buttonTextColor', formData.buttonTextColor || getContrastColor(formData.primaryColor));
            
            dataToUpload.append('enabledCreated', String(!!formData.enabledCreated));
            dataToUpload.append('enabledShipped', String(!!formData.enabledShipped));
            dataToUpload.append('enabledDelivered', String(!!formData.enabledDelivered));
            dataToUpload.append('enabledCanceled', String(!!formData.enabledCanceled));
            
            if (formData.storeUrl) dataToUpload.append('storeUrl', formData.storeUrl);
            if (formData.supportPhone) dataToUpload.append('supportPhone', formData.supportPhone);
            if (formData.supportEmail) dataToUpload.append('supportEmail', formData.supportEmail);
            
            if (logoFile) {
                dataToUpload.append('logoUrl', logoFile);
            }

            await NotificationSettingsService.updateSettings(dataToUpload);
            
            setAlert({
                open: true,
                title: 'Configuraciones actualizadas exitosamente.',
                severity: 'success'
            });

            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            setLogoFile(null);
            setPreviewUrl('');

            await Promise.all([
                fetchSettings(),
                fetchMailPreview(selectedTemplate)
            ]);
            
        } catch (error) {
            console.error('Error updating settings:', error);
            setAlert({
                open: true,
                title: 'Error al actualizar las configuraciones.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (file: File) => {
        setLogoFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const removeFile = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setLogoFile(null);
        setPreviewUrl('');
    };

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'primaryColor') {
                newState.buttonTextColor = getContrastColor(value);
            }
            return newState;
        });
    }, []);

    const handleToggleChange = useCallback((name: keyof NotificationSettings) => {
        setFormData(prev => ({ ...prev, [name]: !prev[name] as any }));
    }, []);

    useEffect(() => {
        fetchSettings();
        fetchMailPreview('shipment-created');
    }, []);

    return {
        formData,
        loading,
        logoFile,
        previewUrl,
        previewHtml,
        selectedTemplate,
        updateSettings,
        handleFileChange,
        removeFile,
        handleInputChange,
        handleToggleChange,
        fetchMailPreview,
        previewLoading,
        alert,
        setAlert
    };
};
