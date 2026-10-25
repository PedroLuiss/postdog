import { useState, useCallback } from 'react';
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import PaymentService from '../services/paymentService';
import { IPayloadCreatePaymentIntent } from '../types';

interface HandlePaymentArgs {
  paymentPayload: IPayloadCreatePaymentIntent;
  cardholderName: string;
}

interface UseStripePaymentResult {
  isProcessing: boolean;
  errorMessage: string | null;
  handlePayment: (args: HandlePaymentArgs) => Promise<{ success: boolean; paymentIntent?: PaymentIntent }>;
}

export const useStripePayment = (): UseStripePaymentResult => {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handlePayment = useCallback(
    async ({ paymentPayload, cardholderName }: HandlePaymentArgs) => {
      if (!stripe || !elements) {
        console.error('Stripe.js no se ha cargado.');
        setErrorMessage('Error de configuración de pago. Intente más tarde.');
        return { success: false };
      }
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) {
        console.error('El elemento de tarjeta no fue encontrado.');
        setErrorMessage('Error al obtener los datos de la tarjeta.');
        return { success: false };
      }

      setIsProcessing(true);
      setErrorMessage(null);

      try {
        let secret = clientSecret;

        if (!secret) {
          const response = await PaymentService.createPaymentIntent(paymentPayload);
          const { data } = response.data;
          secret = data.clientSecret;
          setClientSecret(secret);
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(secret, {
          payment_method: {
            card: cardNumberElement,
            billing_details: { name: cardholderName },
          },
        });

        if (error) {
          setErrorMessage(error.message || 'Ocurrió un error inesperado al procesar el pago.');
          return { success: false };
        }

        if (paymentIntent?.status === 'succeeded') {
          setClientSecret(null);
          return { success: true, paymentIntent };
        } else {
          setErrorMessage(`El pago no fue exitoso. Estado: ${paymentIntent?.status}`);
          return { success: false };
        }
      } catch (error: any) {
        setClientSecret(null);
        setErrorMessage(error.message || 'Error de comunicación con el servidor de pagos.');
        return { success: false };
      } finally {
        setIsProcessing(false);
      }
    },
    [stripe, elements, clientSecret] 
  );

  return { isProcessing, errorMessage, handlePayment };
};