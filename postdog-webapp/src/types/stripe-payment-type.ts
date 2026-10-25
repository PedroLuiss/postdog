
export type IPayloadCreatePaymentIntent = {
  amount: number;
  currency: 'MXN' | 'USD' | 'EUR';
  customerEmail?: string;
};



type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

interface PaymentIntentData {
  clientSecret: string;
  intentId: string;
  status: PaymentIntentStatus;
}

export interface PaymentIntentResponse {
  statusCode: number;
  message: string;
  data: {
    data: PaymentIntentData;
    message: string;
  };
}


export type PaymentMethod = 'card' | 'spei' | 'paypal';

export type PaymentStatus = 'idle' | 'success' | 'error';
export interface CardElementsState {
  cardNumber: boolean;
  cardExpiry: boolean;
  cardCvc: boolean;
}