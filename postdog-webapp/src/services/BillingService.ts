import { HttpService } from './apiClient';
import { FiscalProfilePayload, Invoice, BillingCatalogsResponse } from '../components/Billing/Type/Billing.Type';
import { Transaction } from '../types/wallet.type';

const BillingService = {
    getCatalogs: async (): Promise<BillingCatalogsResponse> => {
        return await HttpService.get<BillingCatalogsResponse>('/billing/catalogs');
    },

    /**
     * Valida si un código postal existe y es válido.
     * @param zipCode El código postal de 5 dígitos.
     */
    validateZipCode: async (zipCode: string): Promise<{ isValid: boolean; message?: string }> => {
        try {
            const data = await HttpService.get<any>(`/postal-codes/${zipCode}`);
            return {
                isValid: !!(data && data.colonies),
                message: undefined
            };
        } catch (error) {
            return { isValid: false, message: 'Código postal no encontrado' };
        }
    },

    /**
     * Obtiene el perfil fiscal del usuario.
     */
    getFiscalProfile: async (): Promise<FiscalProfilePayload | null> => {
        try {
            return await HttpService.get<FiscalProfilePayload>('/billing/fiscal-profile');
        } catch (error) {
            console.error('Error al obtener perfil fiscal', error);
            return null;
        }
    },

    /**
     * Crea o actualiza el perfil fiscal del usuario.
     * @param payload Los datos del formulario de facturación.
     */
    createBillingProfile: async (payload: FiscalProfilePayload): Promise<any> => {
        return await HttpService.post('/billing/fiscal-profile', payload);
    },

    getInvoices: async (): Promise<Invoice[]> => {
        return await HttpService.get<Invoice[]>('/billing/invoices');
    },

    getInvoiceableMovements: async (): Promise<Transaction[]> => {
        return await HttpService.get<Transaction[]>('/billing/invoiceable-movements');
    },

    emitInvoice: async (transactionIds: string[]): Promise<Invoice> => {
        return await HttpService.post<Invoice, { transactionIds: string[] }>('/billing/invoice', { transactionIds });
    },

    downloadInvoices: async (invoiceUids: string[], format: string = 'pdf'): Promise<Blob> => {
        const response = await HttpService.download('/billing/invoices/download', { invoiceUids, format });
        return response.data;
    }
};

export default BillingService;
