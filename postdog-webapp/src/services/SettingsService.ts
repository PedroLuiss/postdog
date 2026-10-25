import { HttpService } from './apiClient';
import { PrintPreferences, LabelsApiResponse } from '../types';

const SettingsService = {
  getPrintPreferencesLabels: async (): Promise<PrintPreferences> => {
    const response = await HttpService.get<LabelsApiResponse>('/settings/labels');
    
    return {
      format: response.defaultLabelFormat === 'THERMAL' ? 'termica' : 'estandar',
      downloadPdf: response.includePackingSlip
    };
  },

  updatePrintPreferencesLabels: async (data: PrintPreferences): Promise<PrintPreferences> => {
    const payload: LabelsApiResponse = {
      defaultLabelFormat: data.format === 'termica' ? 'THERMAL' : 'LETTER',
      includePackingSlip: data.downloadPdf
    };

    const response = await HttpService.put<LabelsApiResponse, LabelsApiResponse>('/settings/labels', payload);

    return {
      format: response.defaultLabelFormat === 'THERMAL' ? 'termica' : 'estandar',
      downloadPdf: response.includePackingSlip
    };
  }
};

export default SettingsService;