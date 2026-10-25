import { useState, useCallback } from 'react';
import { FormValuesReport } from '../types';
import { SendReportProblemServices } from '../services/ReportProblemService';

type ApiResponse = Awaited<ReturnType<typeof SendReportProblemServices>>;

interface ApiState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export const useSendReportProblem = () => {
  const [state, setState] = useState<ApiState<ApiResponse>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (formData: FormValuesReport) => {
    setState({ data: null, error: null, isLoading: true });

    try {
      const response = await SendReportProblemServices(formData);
      setState({ data: response, error: null, isLoading: false });
    } catch (err) {
      setState({ data: null, error: err as Error, isLoading: false });
    }
  }, []);

  return { ...state, execute };
};