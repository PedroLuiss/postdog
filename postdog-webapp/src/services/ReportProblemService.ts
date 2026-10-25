import { FormValuesReport } from '../types';

interface SendReportProblemServicesResponse {
  success: boolean;
  message: string;
}

export const SendReportProblemServices = async (data: FormValuesReport): Promise<SendReportProblemServicesResponse> => {

  await new Promise(resolve => setTimeout(resolve, 2000));

  if (Math.random() < 0.2) {
    throw new Error('Error de red simulado. Inténtalo de nuevo.');
  }

  return {
    success: true,
    message: 'Tu reporte ha sido enviado con éxito.',
  };
};