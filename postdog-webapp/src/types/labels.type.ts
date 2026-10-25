export interface PrintPreferences {
  format: 'termica' | 'estandar';
  downloadPdf: boolean;
}

export interface LabelsApiResponse {
  defaultLabelFormat: 'THERMAL' | 'LETTER';
  includePackingSlip: boolean;
  updatedAt?: string;
}
