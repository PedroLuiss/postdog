import { useState, useEffect, useCallback } from 'react';
import { Invoice } from '../../../Type/Billing.Type';
import { Transaction } from '../../../../../types/wallet.type';

interface UseInvoiceDetailsProps {
    isOpen: boolean;
    invoice: Invoice | null;
}

export const useInvoiceDetails = ({ isOpen, invoice }: UseInvoiceDetailsProps) => {
    const [movements, setMovements] = useState<Transaction[]>([]);
    const [isLoadingMovements, setIsLoadingMovements] = useState(false);
    const [isMovementsExpanded, setIsMovementsExpanded] = useState(false);

    const fetchMovements = useCallback(async () => {
        if (!invoice) return;
        setIsLoadingMovements(true);
        try {
            setMovements([]);
        } catch (error) {
            console.error('Error fetching invoice movements:', error);
            setMovements([]);
        } finally {
            setIsLoadingMovements(false);
        }
    }, [invoice]);

    useEffect(() => {
        if (isOpen && invoice) {
            fetchMovements();
            setIsMovementsExpanded(false);
        }
    }, [isOpen, invoice, fetchMovements]);

    const formattedDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
    };

    return {
        movements,
        isLoadingMovements,
        isMovementsExpanded,
        setIsMovementsExpanded,
        formattedDate,
        fetchMovements
    };
};
