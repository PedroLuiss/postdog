import { HttpService } from './apiClient';
import { WalletBalance, TransactionResponse } from '../types/wallet.type';

export const WalletService = {
    getBalance: async (): Promise<WalletBalance> => {
        try {
            const response = await HttpService.get<WalletBalance>('/wallet/balance');
            return response;
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
            throw new Error("No se pudo obtener el saldo de la billetera.");
        }
    },
    getTransactions: async (page: number = 1, limit: number = 10): Promise<TransactionResponse> => {
        try {
            const response = await HttpService.get<TransactionResponse>(`/wallet/transactions?page=${page}&limit=${limit}`);
            return response;
        } catch (error) {
            console.error("Error fetching transactions:", error);
            throw new Error("No se pudieron obtener los movimientos de la billetera.");
        }
    }
};

export default WalletService;
