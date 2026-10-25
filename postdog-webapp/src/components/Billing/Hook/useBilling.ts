import { useState, useCallback, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';
import {
    BillingFormData,
    AutoBillingMode,
    Invoice
} from '../Type/Billing.Type';
import { Transaction } from '../../../types/wallet.type';
import BillingService from '../../../services/BillingService';
import { useEffect } from 'react';
import { useNotification } from '../../../context/NotificationContext';

export const useBilling = () => {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [hasBillingData, setHasBillingData] = useState(false);
    const [formData, setFormData] = useState<BillingFormData>({
        rfc: '',
        razonSocial: '',
        regimenFiscal: '',
        formaPago: '',
        usoCfdi: '',
        codigoPostal: ''
    });

    const [isAutoBillingActive, setIsAutoBillingActive] = useState(false);
    const [autoBillingMode, setAutoBillingMode] = useState<AutoBillingMode>('recharge');
    const [isAutoBillingModalOpen, setIsAutoBillingModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'movimientos' | 'historial'>('movimientos');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
    const [movements, setMovements] = useState<Transaction[]>([]);
    const [selectedMovementIds, setSelectedMovementIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEmitting, setIsEmitting] = useState(false);
    const [selectedInvoiceForDetails, setSelectedInvoiceForDetails] = useState<Invoice | null>(null);
    const [isDownloadingInvoices, setIsDownloadingInvoices] = useState(false);


    const [searchTerm, setSearchTerm] = useState('');
    const isAnySelected = selectedInvoiceIds.length > 0 || selectedMovementIds.length > 0;
    const isAllSelected = invoices.length > 0 && selectedInvoiceIds.length === invoices.length;
    const isAllMovementsSelected = movements.length > 0 && selectedMovementIds.length === movements.length;

    const filteredInvoices = useMemo(() => {
        if (!searchTerm.trim()) return invoices;
        const term = searchTerm.trim().toLowerCase();
        return invoices.filter((invoice) => {
            const matchesInvoiceNumber = invoice.invoiceNumber?.toLowerCase().includes(term);
            const matchesTotal = parseFloat(invoice.total).toFixed(2).includes(term);
            return matchesInvoiceNumber || matchesTotal;
        });
    }, [invoices, searchTerm]);

    const handleOpenInvoiceDetails = useCallback((invoice: Invoice) => {

        setSelectedInvoiceForDetails(invoice);
    }, []);

    const handleCloseInvoiceDetails = useCallback(() => {
        setSelectedInvoiceForDetails(null);
    }, []);

    const transformedMovements = movements.map(mov => {
        const amount = typeof mov.amount === 'string' ? parseFloat(mov.amount) : mov.amount;
        return {
            ...mov,
            amount,
            uiConcept: mov.uiConcept || (mov.referenceType === 'TOP_UP' ? 'Recarga de saldo' : mov.referenceType || 'Movimiento'),
            uiDescription: mov.uiDescription || mov.referenceId || ''
        };
    });

    const billingTotals = selectedMovementIds.reduce((acc, id) => {
        const movement = transformedMovements.find(m => m.uid === id);
        if (movement) {
            acc.total += movement.amount;
        }
        return acc;
    }, { subtotal: 0, iva: 0, total: 0 });

    billingTotals.subtotal = billingTotals.total / 1.16;
    billingTotals.iva = billingTotals.total - billingTotals.subtotal;

    const fetchInvoices = useCallback(async () => {
        try {
            const data = await BillingService.getInvoices();
            setInvoices(data || []);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        }
    }, []);

    const fetchInvoiceableMovements = useCallback(async () => {
        try {
            const data = await BillingService.getInvoiceableMovements();
            setMovements(data || []);
        } catch (error) {
            console.error('Error fetching invoiceable movements:', error);
        }
    }, []);

    const fetchProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const [profile, invoicesData, movementsData] = await Promise.all([
                BillingService.getFiscalProfile(),
                BillingService.getInvoices(),
                BillingService.getInvoiceableMovements()
            ]);

            if (profile) {
                setFormData({
                    rfc: profile.rfc,
                    razonSocial: profile.businessName,
                    regimenFiscal: profile.taxRegime,
                    formaPago: profile.paymentMethod,
                    usoCfdi: profile.cfdiUse,
                    codigoPostal: profile.postalCode,
                    personType: profile.personType
                });
                setIsAutoBillingActive(profile.autoInvoiceEnabled);
                setAutoBillingMode(profile.autoInvoiceType === 'PER_RECHARGE' ? 'recharge' : 'monthly');
                setHasBillingData(true);
            }

            if (invoicesData) {
                setInvoices(invoicesData);
            }

            if (movementsData) {
                setMovements(movementsData);
            }
        } catch (error) {
            console.error('Error fetching billing data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        const handleRefresh = () => fetchProfile();
        window.addEventListener('wallet-updated', handleRefresh);
        return () => window.removeEventListener('wallet-updated', handleRefresh);
    }, [fetchProfile]);

    const handleRegisterFiscalData = useCallback(() => {
        setIsDrawerOpen(true);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const handleBillingSuccess = useCallback((newData?: BillingFormData) => {
        if (newData) {
            setFormData(newData);
        }
        setHasBillingData(true);
        setIsDrawerOpen(false);
        fetchProfile();
    }, [fetchProfile]);

    const handleEditFiscalProfile = useCallback(() => {
        setIsDrawerOpen(true);
    }, []);

    const handleToggleAutoBilling = useCallback(async () => {
        if (!isAutoBillingActive) {
            setIsAutoBillingModalOpen(true);
        } else {
            try {
                const payload = {
                    personType: formData.personType as 'PHYSICAL' | 'MORAL',
                    rfc: formData.rfc,
                    businessName: formData.razonSocial,
                    taxRegime: formData.regimenFiscal,
                    paymentMethod: formData.formaPago,
                    cfdiUse: formData.usoCfdi,
                    postalCode: formData.codigoPostal,
                    autoInvoiceEnabled: false,
                    autoInvoiceType: autoBillingMode === 'recharge' ? 'PER_RECHARGE' : 'MONTHLY'
                };
                await BillingService.createBillingProfile(payload as any);
                setIsAutoBillingActive(false);
                showNotification('Facturación automática desactivada', '', 'success');
            } catch (error) {
                console.error(error);
                showNotification('Error al desactivar la facturación automática', '', 'error');
            }
        }
    }, [isAutoBillingActive, formData, autoBillingMode, showNotification]);

    const handleSaveAutoBillingConfig = useCallback(async (mode: AutoBillingMode) => {
        try {
            const payload = {
                personType: formData.personType as 'PHYSICAL' | 'MORAL',
                rfc: formData.rfc,
                businessName: formData.razonSocial,
                taxRegime: formData.regimenFiscal,
                paymentMethod: formData.formaPago,
                cfdiUse: formData.usoCfdi,
                postalCode: formData.codigoPostal,
                autoInvoiceEnabled: true,
                autoInvoiceType: mode === 'recharge' ? 'PER_RECHARGE' : 'MONTHLY'
            };
            await BillingService.createBillingProfile(payload as any);
            setAutoBillingMode(mode);
            setIsAutoBillingActive(true);
            setIsAutoBillingModalOpen(false);
            showNotification('Facturación automática activada', '', 'success');
        } catch (error) {
            console.error(error);
            showNotification('Error al activar la facturación automática', '', 'error');
        }
    }, [formData, showNotification]);

    const handleCloseAutoBillingModal = useCallback(() => {
        setIsAutoBillingModalOpen(false);
    }, []);

    const handleToggleInvoiceSelection = useCallback((id: string) => {
        setSelectedInvoiceIds(prev =>
            prev.includes(id) ? prev.filter(invoiceId => invoiceId !== id) : [...prev, id]
        );
    }, []);

    const handleToggleSelectAll = useCallback(() => {
        if (selectedInvoiceIds.length === invoices.length) {
            setSelectedInvoiceIds([]);
        } else {
            setSelectedInvoiceIds(invoices.map((invoice: Invoice) => invoice.uid));
        }
    }, [selectedInvoiceIds, invoices]);

    const handleToggleMovementSelection = useCallback((id: string) => {
        setSelectedMovementIds(prev =>
            prev.includes(id) ? prev.filter(movementId => movementId !== id) : [...prev, id]
        );
    }, []);

    const handleToggleSelectAllMovements = useCallback(() => {
        if (selectedMovementIds.length === movements.length) {
            setSelectedMovementIds([]);
        } else {
            setSelectedMovementIds(movements.map((movement) => movement.uid));
        }
    }, [selectedMovementIds, movements]);

    const handleNavigateToMovements = useCallback(() => {
        navigate('/shipping/NoMovementsRecorded');
    }, [navigate]);

    const handleEmitInvoice = useCallback(async () => {
        if (selectedMovementIds.length === 0) return;

        setIsEmitting(true);
        try {
            await BillingService.emitInvoice(selectedMovementIds);
            setSelectedMovementIds([]);
            setActiveTab('historial');
            await Promise.all([fetchInvoices(), fetchInvoiceableMovements()]);
            showNotification('Factura emitida correctamente', '', 'success');
        } catch (error) {
            console.error('Error emitting invoice:', error);
        } finally {
            setIsEmitting(false);
        }
    }, [selectedMovementIds, fetchInvoices, fetchInvoiceableMovements, showNotification]);
    const handleDownloadInvoices = useCallback(async () => {
        if (selectedInvoiceIds.length === 0) return;

        setIsDownloadingInvoices(true);
        try {
            const isBulk = selectedInvoiceIds.length > 1;
            const format = isBulk ? 'rar' : 'pdf';
            const blob = await BillingService.downloadInvoices(selectedInvoiceIds, format);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            const fileName = isBulk
                ? `Facturas_Comprimidas.rar`
                : `Factura_${invoices.find(inv => inv.uid === selectedInvoiceIds[0])?.invoiceNumber || selectedInvoiceIds[0]}.pdf`;

            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            showNotification('Descarga iniciada', '', 'success');
        } catch (error) {
            console.error('Error al descargar las facturas:', error);
            showNotification('Error al descargar las facturas', '', 'error');
        } finally {
            setIsDownloadingInvoices(false);
        }
    }, [selectedInvoiceIds, invoices, showNotification]);

    const handleDownloadSingleInvoice = useCallback(async (invoiceId: string, invoiceNumber?: string) => {
        try {
            const blob = await BillingService.downloadInvoices([invoiceId], 'pdf');

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Factura_${invoiceNumber || invoiceId}.pdf`;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error al descargar la factura:', error);
            showNotification('Error al descargar la factura', '', 'error');
        }
    }, [showNotification]);

    return {
        isDrawerOpen,
        hasBillingData,
        formData,
        handleRegisterFiscalData,
        handleCloseDrawer,
        handleBillingSuccess,
        handleEditFiscalProfile,
        isAutoBillingActive,
        autoBillingMode,
        isAutoBillingModalOpen,
        handleToggleAutoBilling,
        handleSaveAutoBillingConfig,
        handleCloseAutoBillingModal,
        activeTab,
        setActiveTab,
        invoices,
        selectedInvoiceIds,
        handleToggleInvoiceSelection,
        handleToggleSelectAll,
        movements,
        selectedMovementIds,
        handleToggleMovementSelection,
        handleToggleSelectAllMovements,
        handleNavigateToMovements,
        handleEmitInvoice,
        billingTotals,
        isEmitting,
        isLoading,
        transformedMovements,
        refreshProfile: fetchProfile,
        selectedInvoiceForDetails,
        handleOpenInvoiceDetails,
        handleCloseInvoiceDetails,
        handleDownloadInvoices,
        isDownloadingInvoices,
        handleDownloadSingleInvoice,
        searchTerm,
        setSearchTerm,
        filteredInvoices,
        isAnySelected,
        isAllSelected,
        isAllMovementsSelected
    };

};
