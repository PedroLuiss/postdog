import { useState, useCallback } from 'react';
import OrderService from '../services/OrdersService';
import { OrderResponse, ShipmentOrder } from '../types';

interface UseShippingQuoteCreationResult {
  isCreating: boolean;
  error: string | null;
  createQuote: (data: ShipmentOrder) => Promise<OrderResponse | null>;
}

export const useShippingQuoteCreation = (): UseShippingQuoteCreationResult => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuote = useCallback(async (data: ShipmentOrder): Promise<OrderResponse | null> => {
    setIsCreating(true);
    setError(null);
    try {
      const success = await OrderService.CreateOrderShipment(data);
      if (success) {
        return success;
      } else {
        const errorMsg = "La cotización no pudo ser creada. Por favor, verifica los datos.";
        setError(errorMsg);
        return null;
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Error al crear el envío";
      setError(errorMsg);
      throw err; // Re-throw so caller can handle status codes
    } finally {
      setIsCreating(false);
    }
  }, []); 

  return { isCreating, error, createQuote };
};