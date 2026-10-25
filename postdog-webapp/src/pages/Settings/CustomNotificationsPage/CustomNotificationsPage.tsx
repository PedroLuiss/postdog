import React, { useDeferredValue } from 'react';
import styles from './CustomNotificationsPage.module.scss';

import ButtonUi from '../../../components/ui/Button/ButtonUi';
import { AlertSnackbar } from '../../../components/ui/AlertSnackbarUi/AlertSnackbar';

import { EmailPersonalizationForm } from '../../../components/CustomNotifications/EmailPersonalizationForm/EmailPersonalizationForm';
import { NotificationPreview } from '../../../components/CustomNotifications/NotificationPreview/NotificationPreview';
import { NotificationStatusGrid } from '../../../components/CustomNotifications/NotificationStatusGrid/NotificationStatusGrid';

import { useNotificationSettings } from './hooks/useNotificationSettings';

export const CustomNotificationsPage = () => {
    const { 
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
    } = useNotificationSettings();
     const deferredFormData = useDeferredValue(formData);

    return (
        <div className={styles['notifications']}>
            <div className={styles['notifications__grid']}>
                
                <EmailPersonalizationForm 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                    removeFile={removeFile}
                    logoFile={logoFile}
                />

                <NotificationPreview 
                    formData={deferredFormData}
                    previewUrl={previewUrl}
                    previewHtml={previewHtml || ''}
                    loading={previewLoading}
                />

                <NotificationStatusGrid 
                    formData={formData}
                    handleToggleChange={handleToggleChange}
                    onSelectTemplate={fetchMailPreview}
                    selectedTemplate={selectedTemplate}
                />

            </div>
            
            <div className={styles['notifications__footer-actions']}>
                <ButtonUi 
                    variant="primary" 
                    className={styles['notifications__footer-actions--button']}
                    onClick={updateSettings}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar'}
                </ButtonUi>
            </div>

            <AlertSnackbar 
                open={alert.open}
                title={alert.title}
                severity={alert.severity}
                onClose={() => setAlert({ ...alert, open: false })}
            />
        </div>
    );
};