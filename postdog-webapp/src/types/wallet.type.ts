export interface WalletBalance {
    balance: string;
    currency: string;
    updated_at: string;
}

export interface Transaction {
    uid: string;
    createdAt: string;
    amount: number | string;
    type: 'CREDIT' | 'DEBIT';
    uiConcept?: string;
    uiDescription?: string;
    referenceType?: string;
    referenceId?: string;
    invoiceId?: string | null;
}

export interface TransactionResponse {
    items: Transaction[];
    meta: {
        totalItems: number;
        currentPage: number;
        totalPages: number;
    };
}
