import { useRef, useState, useCallback } from 'react';
import { Quote, QuoteFormData, StreamRequestData } from '../types';
import quoteService from '../services/quoteService';

export const useQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);


  const getQuotes = useCallback(async (requestData: StreamRequestData) => {
    setIsStreaming(true);
    setError(null);
    setQuotes([]);

    try {
      await quoteService.getQuotesServices(requestData, {
        onQuote: (newQuote) => {
          setQuotes((prevQuotes) => [...prevQuotes, newQuote]);
        },
        onEnd: () => {
          setIsStreaming(false); 
        },
        onError: (err) => {
          setError(err.message || 'Error durante el streaming de cotizaciones.');
          setIsStreaming(false);
        }
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al iniciar la búsqueda de cotizaciones.';
      setError(message);
      setQuotes([]);
      setIsStreaming(false);
    }
  }, []);



  const fetchQuotes = useCallback(async (formData: Partial<QuoteFormData>) => {
    setIsStreaming(true);
    setError(null);
    setQuotes([]);

    try {
      const data = await quoteService.createQuoteRequestServices(formData);
      setQuotes(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al buscar las cotizaciones.';
      setError(message);
      setQuotes([]);
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const saveSelectedQuote = useCallback(async (quote: Quote) => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(null);

    try {
      const response = await quoteService.saveFinalShipmentServices(quote);
      setSaveSuccess(response.message);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al guardar el envío.';
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    quotes,
    loading: isStreaming,
    error,
    fetchQuotes,
    saveSelectedQuote,
    isSavingSelectedQuote: isSaving,
    saveSuccessSelectedQuote: saveSuccess,
    getQuotes
  };
};
