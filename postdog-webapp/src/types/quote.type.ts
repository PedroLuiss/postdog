export interface Quote {
    id:  string;
    courierLogo: string;
    courierName: string;
    selected?: boolean;
    service: string;
    pickup: 'Disponible' | 'No disponible';
    deliveryEstimateDays: number;
    price: number;
    pickupAvailable?: boolean;
    trackingAvailable?: boolean;
    thermalPrintingAvailable?: boolean;
}

export interface FormattedPackaging {
    id: string;
    name: string;
    logo: string;
    estimate: string;
    price: number;
    pickup: boolean;
    pickupAvailable?: boolean;
    trackingAvailable?: boolean;
    thermalPrintingAvailable?: boolean;
}

export interface QuoteFormData {
    originPostalCode: string;
    originCountry: string;
    destinationPostalCode: string;
    destinationCountry: string;
    productTypeCode: string;
    productTypeDescription: string;
    savedPackageId: string;
    length: number | string;
    height: number | string;
    width: number | string;
    weight: number | string;
}

export type StartEvent = { type: "start"; ts: string; };
export type ItemEvent = {
    type: "item";
    data: {
        uid: string;
        carrierCode: string;
        carrierName: string; 
        serviceCode: string;
        priceAmount: number;
        currency: string;
        deliveryDaysMin: number;
        deliveryDaysMax: number;
        pickupAvailable: boolean; 
        logoUrl: string; 
        t_ms: number;
        trackingAvailable: boolean;
        thermalPrintingAvailable: boolean;
    };
};

export type EndEvent = { type: "end"; meta: { count: number; partial: boolean; errors: any[]; }; };
export type ShippingEvent = StartEvent | ItemEvent | EndEvent;

export interface StreamRequestData {
    currency: string;
    addresses: any[];
    packages: any[]; 
}

export interface QuoteStreamCallbacks {
    onStart?: (ts?: string) => void;
    onQuote?: (quote: Quote) => void;
    onEnd?: (meta: { count: number; partial: boolean; errors: any[] } | null) => void;
    onError?: (error: Error) => void;
}