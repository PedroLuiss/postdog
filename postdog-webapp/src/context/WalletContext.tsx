import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import WalletService from '../services/walletService';
import { WalletBalance } from '../types/wallet.type';
import { useAppContext } from './AppContext';

interface WalletContextType {
    balance: WalletBalance | null;
    isLoading: boolean;
    error: string | null;
    addOptimisticBalance: (amount: number) => void;
    refreshBalance: (isBackground?: boolean) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAppContext() || {};
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
            setError(err instanceof Error ? err.message : 'Error al obtener saldo');
        } finally {
            if (!isBackground) setIsLoading(false);
        }
    }, []);

    const addOptimisticBalance = useCallback((amount: number) => {
        setBalance(prev => {
            if (!prev) return prev;
            const newTotal = parseFloat(prev.balance) + amount;
            return {
                ...prev,
                balance: newTotal.toFixed(2)
            };
        });
    }, []);

    useEffect(() => {
        if (user) {
            fetchBalance();
        }
    }, [user, fetchBalance]); 

    return (
        <WalletContext.Provider 
            value={{ 
                balance, 
                isLoading, 
                error, 
                addOptimisticBalance, 
                refreshBalance: fetchBalance
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWalletContext = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error('useWalletContext debe usarse dentro de WalletProvider');
    return context;
};