import React from 'react';

import { Download as DownloadIcon } from 'lucide-react';

import { FiscalProfileCard } from './FiscalProfileCard/FiscalProfileCard';
import { AutoBillingCard } from './AutoBillingCard/AutoBillingCard';
import { AutoBillingModal } from './AutoBillingModal/AutoBillingModal';
import { BillingSummaryCard } from './BillingSummaryCard/BillingSummaryCard';
import { InvoiceDetailsModal } from '../InvoiceDetailsModal/InvoiceDetailsModal';
import { FilterUi } from '../../../ui/FilterUi/FilterUi';
import { BillingActiveStateProps } from '../../Type/Billing.Type';

import { BillingTable } from './BillingTable/BillingTable';
import styles from './BillingActiveState.module.scss';

export const BillingActiveState: React.FC<BillingActiveStateProps> = ({
    formData,
    isAutoBillingActive,
    autoBillingMode,
    onEditFiscalProfile,
    onToggleAutoBilling,
    onSaveAutoBillingConfig,
    isAutoBillingModalOpen,
    onCloseAutoBillingModal,
    activeTab,
    setActiveTab,
    invoices,
    selectedInvoiceIds,
    onToggleInvoiceSelection,
    onToggleSelectAll,
    movements,
    selectedMovementIds,
    onToggleMovementSelection,
    onToggleSelectAllMovements,
    onNavigateToMovements,
    billingTotals,
    handleEmitInvoice,
    isEmitting,
    selectedInvoiceForDetails,
    onOpenInvoiceDetails,
    onCloseInvoiceDetails,
    handleDownloadInvoices,
    isDownloadingInvoices,
    handleDownloadSingleInvoice,
    searchTerm,
    setSearchTerm,
    filteredInvoices,
    isAnySelected,
    isAllSelected,
    isAllMovementsSelected
}) => {


    return (
        <div className={styles['container']}>
            <div className={styles['tabs-navigation']}>
                <button
                    className={`${styles['tab-item']} ${activeTab === 'movimientos' ? styles['tab-item--active'] : ''}`}
                    onClick={() => setActiveTab('movimientos')}
                >
                    Movimientos
                </button>
                <button
                    className={`${styles['tab-item']} ${activeTab === 'historial' ? styles['tab-item--active'] : ''}`}
                    onClick={() => setActiveTab('historial')}
                >
                    Historial de facturas
                </button>
            </div>

            <div className={styles['billing-container']}>
                <div className={styles['main-content-area']}>
                    <div className={styles['billing-card']}>
                        <div className={styles['search-container']}>
                            <FilterUi className={styles['billing-filter']}>
                                <FilterUi.Search
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}

                                    placeholder="Buscar por folio, RFC o razón social"
                                    iconSize={20}
                                />
                            </FilterUi>
                        </div>

                        <div className={styles['card-content-tools']}>
                            {(activeTab === 'historial' && !isAutoBillingActive) && (
                                <div className={styles['historial-actions']}>
                                    <div className={styles['checkbox-all']}>
                                        <input
                                            type="checkbox"
                                            className={styles['table-checkbox']}
                                            id="select-all"
                                            checked={isAllSelected}
                                            onChange={onToggleSelectAll}
                                        />
                                        <label htmlFor="select-all">Seleccionar todos</label>
                                    </div>
                                    <button
                                        className={styles['btn-outline-red']}
                                        disabled={selectedInvoiceIds.length === 0 || isDownloadingInvoices}
                                        onClick={handleDownloadInvoices}
                                    >
                                        <DownloadIcon /> {isDownloadingInvoices ? 'Descargando...' : 'Descargar facturas'}
                                    </button>
                                </div>
                            )}

                            {(activeTab === 'movimientos' && !isAutoBillingActive) && (
                                <div className={styles['checkbox-all']}>
                                    <input
                                        type="checkbox"
                                        className={styles['table-checkbox']}
                                        id="select-all-movimientos"
                                        checked={isAllMovementsSelected}
                                        onChange={onToggleSelectAllMovements}
                                    />
                                    <label htmlFor="select-all-movimientos">Seleccionar todos</label>
                                </div>
                            )}

                            {activeTab === 'movimientos' && (
                                <p className={styles['table-description']}>
                                    En esta tabla se muestran únicamente tus recargas del mes actual. Si deseas ver tu historial de movimientos, visita la sección <span className={styles['link-movimientos']} onClick={onNavigateToMovements}>Movimientos</span>.
                                </p>
                            )}
                        </div>

                        <BillingTable
                            activeTab={activeTab}
                            isAutoBillingActive={isAutoBillingActive}
                            movements={movements}
                            selectedMovementIds={selectedMovementIds}
                            onToggleMovementSelection={onToggleMovementSelection}
                            invoices={filteredInvoices}
                            selectedInvoiceIds={selectedInvoiceIds}
                            onToggleInvoiceSelection={onToggleInvoiceSelection}
                            onOpenInvoiceDetails={onOpenInvoiceDetails}
                            handleDownloadSingleInvoice={handleDownloadSingleInvoice}
                        />
                    </div>
                </div>

                <aside className={styles['sidebar-stack']}>
                    <AutoBillingCard
                        isActive={isAutoBillingActive}
                        onToggle={onToggleAutoBilling}
                    />

                    <FiscalProfileCard
                        formData={formData}
                        onEdit={onEditFiscalProfile}
                    />

                    {(activeTab === 'movimientos' && !isAutoBillingActive) && (
                        <BillingSummaryCard
                            subtotal={billingTotals.subtotal}
                            iva={billingTotals.iva}
                            total={billingTotals.total}
                            currency="MXN"
                            onEmit={handleEmitInvoice}
                            isEmitting={isEmitting}
                        />
                    )}
                </aside>
            </div>

            <AutoBillingModal
                isOpen={isAutoBillingModalOpen}
                onClose={onCloseAutoBillingModal}
                onSave={onSaveAutoBillingConfig}
                currentMode={autoBillingMode}
            />

            <InvoiceDetailsModal
                isOpen={!!selectedInvoiceForDetails}
                onClose={onCloseInvoiceDetails}
                invoice={selectedInvoiceForDetails}
                onDownload={handleDownloadSingleInvoice}
            />
        </div>
    );
};
