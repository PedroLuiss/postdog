import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../../../../context/NotificationContext';
import SettingsService from '../../../../services/SettingsService';
import { PrintPreferences } from '../../../../types';

export const useLabelsForm = () => {
  const { showNotification } = useNotification();
  
  const [format, setFormat] = useState<string>('termica');
  const [downloadPdf, setDownloadPdf] = useState<boolean>(true);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadPreferences = useCallback(async () => {
    try {
      const prefs = await SettingsService.getPrintPreferencesLabels();
      setFormat(prefs.format);
      setDownloadPdf(prefs.downloadPdf);
    } catch (error: any) {
      showNotification("Error", "No se pudieron cargar tus preferencias.", 'error', 4000);
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormat(e.target.value);
  };

  const handleDownloadPdfChange = (val: boolean) => {
    setDownloadPdf(val);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: PrintPreferences = {
        format: format as 'termica' | 'estandar',
        downloadPdf
      };
      
      await SettingsService.updatePrintPreferencesLabels(payload);
      
      showNotification("Proceso Exitoso", "Preferencias de impresión guardadas.", 'success', 3000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error al guardar los cambios.";
      showNotification("Ups, algo salió mal", errorMsg, 'error', 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    format,
    downloadPdf,
    isLoading,
    isSaving,
    handleFormatChange,
    handleDownloadPdfChange,
    handleSave,
  };
};