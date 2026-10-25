import { useState, useEffect, useCallback } from 'react';
import WalletService from '../../../services/walletService';
import { Transaction, TransactionResponse } from '../../../types/wallet.type';

export const useMovements = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [meta, setMeta] = useState<TransactionResponse['meta'] | null>(null);

    const fetchTransactions = useCallback(async (page: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await WalletService.getTransactions(page);
            setTransactions(data.items);
            setMeta(data.meta);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los movimientos');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    useEffect(() => {
        const handleRefresh = () => fetchTransactions();
        window.addEventListener('wallet-updated', handleRefresh);
        return () => window.removeEventListener('wallet-updated', handleRefresh);
    }, [fetchTransactions]);

    return {
        transactions,
        loading,
        error,
        meta,
        refetch: fetchTransactions
    };
};
