import { IPayloadCreatePaymentIntent, PaymentIntentResponse } from '../types';
import { HttpService } from './apiClient';
import { PaymentConfigResponse } from '../components/Layout/ModalCredits/BuyCreditsFormModal/types/buy-credits.type';

const PaymentService = {
    createPaymentIntent: async (payload: IPayloadCreatePaymentIntent): Promise<PaymentIntentResponse> => {
        try {
            const response = await HttpService.post<PaymentIntentResponse, any>('/payments/create-intent', payload);
            return response;
        } catch (error) {
            console.error("Error creating Payment Intent:", error);
            throw new Error('No se pudo iniciar el proceso de pago. Intente de nuevo.');
        }
    },

    getConfig: async (): Promise<PaymentConfigResponse> => {
        try {
            const response = await HttpService.get<PaymentConfigResponse>('/payments/config');
            return response;
        } catch (error) {
            console.error("Error fetching payment config:", error);
            throw new Error("No se pudo obtener la configuración de pagos.");
        }
    }
};

export default PaymentService;