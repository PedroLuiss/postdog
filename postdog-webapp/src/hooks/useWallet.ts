import { useState, useEffect, useCallback } from 'react';
import WalletService from '../services/walletService';
import { WalletBalance } from '../types/wallet.type';

export const useWallet = () => {
    const [balance, setBalance] = useState<WalletBalance | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBalance = useCallback(async (isBackground = false) => {
        try {
            if (!isBackground) setIsLoading(true);
            const data = await WalletService.getBalance();
            setBalance(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            if (!isBackground) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBalance();
        fetchBalance(true);
    }, [fetchBalance]);

    return {
        balance,
        isLoading,
        error,
        refreshBalance: fetchBalance
    };
};
