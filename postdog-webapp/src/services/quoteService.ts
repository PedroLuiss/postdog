
import { Quote, QuoteFormData, QuoteStreamCallbacks, ShippingEvent, StreamRequestData } from '../types';
import { mockQuotesData } from '../utils/mooks';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api-pdog.softmena.dev";

const quoteService = {

    getQuotesServices: (requestData: StreamRequestData, callbacks?: QuoteStreamCallbacks): Promise<Quote[]> => {
        return new Promise(async (resolve, reject) => {
            const collectedQuotes: Quote[] = [];
            const { onQuote, onStart, onEnd, onError } = callbacks || {};

            try {
                const storedData = localStorage.getItem('user');
                const user = storedData ? JSON.parse(storedData) : null;
                const token = user?.access_token;
                const url = `${API_BASE_URL}/carriers-quotes/stream`;
                const response = await fetch(url, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "text/event-stream",
                        ...(token && { "Authorization": `Bearer ${token}` }),
                    },
                    body: JSON.stringify(requestData),
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                if (!response.body) throw new Error("No readable stream");

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) continue;

                        const jsonStr = trimmedLine.startsWith("data:")
                            ? trimmedLine.replace("data:", "").trim()
                            : trimmedLine;

                        try {
                            const event: ShippingEvent = JSON.parse(jsonStr);

                            if (event.type === 'start') {
                                onStart?.(event.ts);
                            }
                            else if (event.type === 'item') {
                                const item = event.data;
                                const newQuote: Quote = {
                                    id: item.uid,
                                    courierLogo: item.logoUrl,
                                    courierName: item.carrierName,
                                    service: item.serviceCode,
                                    deliveryEstimateDays: item.deliveryDaysMax,
                                    price: item.priceAmount,
                                    pickup: item.pickupAvailable ? 'Disponible' : 'No disponible',
                                    pickupAvailable: item.pickupAvailable,
                                    trackingAvailable: item.trackingAvailable,
                                    thermalPrintingAvailable: item.thermalPrintingAvailable,
                                    selected: false,
                                };
                                collectedQuotes.push(newQuote);
                                onQuote?.(newQuote);
                            }
                            else if (event.type === 'end') {
                                onEnd?.(event.meta);
                            }
                        } catch (e) {
                            console.error("Error parsing chunk:", jsonStr);
                        }
                    }
                }

                resolve(collectedQuotes);
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                onError?.(error);
                reject(error);
            }
        });
    },
    createQuoteRequestServices: (formData: Partial<QuoteFormData>): Promise<Quote[]> => {
        return new Promise((resolve, reject) => {
            //  const response = await axios.post<Quote[]>('/api/quote', data);
            // return response.data;
            setTimeout(() => {
                if (!formData.originPostalCode || !formData.destinationPostalCode) {
                    reject(new Error("El código postal de origen y destino son obligatorios."));
                    return;
                }
                resolve(mockQuotesData);
            }, 1500);
        });
    },
    saveFinalShipmentServices: (selectedQuote: Quote): Promise<{ message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: "Envío creado exitosamente." });
            }, 2000);
        });
    }
};
export default quoteService;
