import { ShippingQuotePayload } from "../types";



export const createShippingQuoteService = async (data: ShippingQuotePayload): Promise<boolean> => {

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        resolve(true);
      } else {
        reject(new Error("Error de red o del servidor al intentar crear la cotización."));
      }
    }, 1500);
  });
};