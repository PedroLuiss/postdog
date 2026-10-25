import React from 'react';
import { useBilling } from './Hook/useBilling';
import { BillingProps } from './Type/Billing.Type';
import { BillingDrawer, BillingEmptyState, BillingActiveState } from './components';
import './Billing.scss';

const Billing: React.FC<BillingProps> = ({
    title = "Tu facturación comienza aquí",
    description = "Postdog te permite facturar automáticamente tus movimientos o seleccionar manualmente los registros que quieras facturar.",
    buttonText = "Registrar datos fiscales",
    onButtonClick
}) => {
    const {
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
        selectedMovementIds,

        handleToggleMovementSelection,
        handleToggleSelectAllMovements,
        handleNavigateToMovements,
        handleEmitInvoice,
        billingTotals,
        isEmitting,
        isLoading,
        transformedMovements,
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
    } = useBilling();


    const handleAction = onButtonClick || handleRegisterFiscalData;

    if (isLoading) {
        return (
            <div className="billing-view-loading">
                <div className="loading-spinner">Cargando datos de facturación...</div>
            </div>
        );
    }

    return (
        <div className="billing-view">
            {!hasBillingData ? (
                <BillingEmptyState
                    title={title}
                    description={description}
                    buttonText={buttonText}
                    onButtonClick={handleAction}
                />
            ) : (
                <BillingActiveState
                    formData={formData}
                    isAutoBillingActive={isAutoBillingActive}
                    autoBillingMode={autoBillingMode}
                    onEditFiscalProfile={handleEditFiscalProfile}
                    onToggleAutoBilling={handleToggleAutoBilling}
                    onSaveAutoBillingConfig={handleSaveAutoBillingConfig}
                    isAutoBillingModalOpen={isAutoBillingModalOpen}
                    onCloseAutoBillingModal={handleCloseAutoBillingModal}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    invoices={invoices}
                    selectedInvoiceIds={selectedInvoiceIds}
                    onToggleInvoiceSelection={handleToggleInvoiceSelection}
                    onToggleSelectAll={handleToggleSelectAll}
                    movements={transformedMovements}
                    selectedMovementIds={selectedMovementIds}
                    onToggleMovementSelection={handleToggleMovementSelection}
                    onToggleSelectAllMovements={handleToggleSelectAllMovements}
                    onNavigateToMovements={handleNavigateToMovements}
                    handleEmitInvoice={handleEmitInvoice}
                    billingTotals={billingTotals}
                    isEmitting={isEmitting}
                    selectedInvoiceForDetails={selectedInvoiceForDetails}
                    onOpenInvoiceDetails={handleOpenInvoiceDetails}
                    onCloseInvoiceDetails={handleCloseInvoiceDetails}
                    handleDownloadInvoices={handleDownloadInvoices}
                    isDownloadingInvoices={isDownloadingInvoices}
                    handleDownloadSingleInvoice={handleDownloadSingleInvoice}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filteredInvoices={filteredInvoices}
                    isAnySelected={isAnySelected}
                    isAllSelected={isAllSelected}
                    isAllMovementsSelected={isAllMovementsSelected}
                />

            )}

            <BillingDrawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                title={hasBillingData ? "Editar datos fiscales" : undefined}
                formData={formData}
                autoInvoiceEnabled={isAutoBillingActive}
                autoInvoiceType={autoBillingMode === 'recharge' ? 'PER_RECHARGE' : 'MONTHLY'}
                onSuccess={handleBillingSuccess}
            />
        </div>
    );
};

export default Billing;