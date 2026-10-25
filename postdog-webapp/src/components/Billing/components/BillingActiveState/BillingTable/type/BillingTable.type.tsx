import { Invoice } from '../../../../Type/Billing.Type';
import { Transaction } from '../../../../../../types/wallet.type';

export interface BillingTableProps {
    activeTab: 'movimientos' | 'historial';
    isAutoBillingActive: boolean;
    movements: Transaction[];
    selectedMovementIds: string[];
    onToggleMovementSelection: (uid: string) => void;
    invoices: Invoice[];
    selectedInvoiceIds: string[];
    onToggleInvoiceSelection: (uid: string) => void;
    onOpenInvoiceDetails: (invoice: Invoice) => void;
    handleDownloadSingleInvoice: (uid: string, invoiceNumber?: string) => Promise<void>;
}
