import React, { useCallback } from 'react';
import { Download as DownloadIcon, FileText } from 'lucide-react';
import { Invoice } from '../../../Type/Billing.Type';
import { BillingTableProps } from './type/BillingTable.type';
import styles from './BillingTable.module.scss';

export const BillingTable: React.FC<BillingTableProps> = ({
    activeTab,
    isAutoBillingActive,
    movements,
    selectedMovementIds,
    onToggleMovementSelection,
    invoices,
    selectedInvoiceIds,
    onToggleInvoiceSelection,
    onOpenInvoiceDetails,
    handleDownloadSingleInvoice
}) => {
    const formatDate = useCallback((date: string) => {
        return new Date(date).toLocaleDateString('es-MX', { day: 'numeric', month: 'numeric', year: 'numeric' });
    }, []);

    return (
        <>
            <div className={styles['table-wrapper']}>
                <table className={styles['facturas-table']}>
                    <thead className={styles['table-header-row']}>
                        <tr>
                            {!isAutoBillingActive && <th className={styles['col-check']} />}
                            <th className={styles['col-date']}>Fecha</th>
                            {activeTab === 'movimientos' ? (
                                <>
                                    <th>Movimiento</th>
                                    <th>Cantidad</th>
                                </>
                            ) : (
                                <>
                                    <th className={styles['col-number']}>Número de factura</th>
                                    <th className={styles['col-amount']}>Cantidad</th>
                                    <th className={styles['col-actions']}>Acciones</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {activeTab === 'movimientos' && movements.map((mov) => (
                            <tr key={mov.uid}>
                                {!isAutoBillingActive && (
                                    <td className={styles['col-check']}>
                                        <input
                                            type="checkbox"
                                            className={styles['table-checkbox']}
                                            checked={selectedMovementIds.includes(mov.uid)}
                                            onChange={() => onToggleMovementSelection(mov.uid)}
                                        />
                                    </td>
                                )}
                                <td className={styles['col-date']}>
                                    <span className={styles['td-date']}>
                                        {new Date(mov.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                    </span>
                                </td>
                                <td>
                                    <span className={styles['td-span']}>
                                        <div className={mov.uiDescription ? styles['mov-concepto-bold'] : styles['mov-concepto-normal']}>{mov.uiConcept}</div>
                                        {mov.uiDescription && <div className={styles['mov-referencia']}>{mov.uiDescription}</div>}
                                    </span>
                                </td>
                                <td className={styles['col-amount']}>
                                    <span className={styles['td-span']}>
                                        <span className={mov.type === 'CREDIT' ? styles['mov-cantidad-positiva'] : styles['mov-cantidad-negativa']}>
                                            {mov.type === 'CREDIT' ? `+ $${Number(mov.amount).toFixed(2)}` : `- $${Number(mov.amount).toFixed(2)}`} MXN
                                        </span>
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {activeTab === 'historial' && invoices.map((invoice: Invoice) => (
                            <tr key={invoice.uid}>
                                {!isAutoBillingActive && (
                                    <td className={styles['col-check']}>
                                        <input
                                            type="checkbox"
                                            className={styles['table-checkbox']}
                                            checked={selectedInvoiceIds.includes(invoice.uid)}
                                            onChange={() => onToggleInvoiceSelection(invoice.uid)}
                                        />
                                    </td>
                                )}
                                <td className={styles['col-date']}>
                                    <span className={styles['td-date']}>
                                        {new Date(invoice.createdAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                                    </span>
                                </td>
                                <td className={styles['col-number']}>
                                    <span className={styles['td-span']}>
                                        {invoice.invoiceNumber}
                                    </span>
                                </td>
                                <td className={styles['col-amount']}>
                                    <span className={styles['td-span']}>
                                        $ {parseFloat(invoice.total).toFixed(2)}
                                    </span>
                                </td>
                                <td className={styles['col-actions']}>
                                    <div className={styles['td-actions-container']}>
                                        <button
                                            className={styles['btn-action']}
                                            onClick={() => onOpenInvoiceDetails(invoice)}
                                        >
                                            <FileText size={16} /> Detalles
                                        </button>
                                        <button
                                            className={styles['btn-action']}
                                            onClick={() => handleDownloadSingleInvoice(invoice.uid, invoice.invoiceNumber)}
                                        >
                                            <DownloadIcon size={16} /> Descargar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className={styles['mobile-list']}>
                {(activeTab === 'movimientos' ? movements : invoices).map((item: any) => (
                    <div key={item.uid} className={styles['billing-card']}>
                        <div className={styles['billing-card__container']}>
                            <div className={styles['billing-card__layout']}>

                                <div className={styles['billing-card__info-group']}>
                                    {!isAutoBillingActive && (
                                        <input
                                            type="checkbox"
                                            className={styles['billing-card__checkbox']}
                                            checked={activeTab === 'movimientos' ? selectedMovementIds.includes(item.uid) : selectedInvoiceIds.includes(item.uid)}
                                            onChange={() => activeTab === 'movimientos' ? onToggleMovementSelection(item.uid) : onToggleInvoiceSelection(item.uid)}
                                        />
                                    )}
                                    <div className={styles['billing-card__content']}>
                                        <div className={styles['billing-card__id']}>
                                            {activeTab === 'movimientos' ? item.uiConcept : item.invoiceNumber}
                                        </div>
                                        <div className={styles['billing-card__date']}>{formatDate(item.createdAt)}</div>
                                    </div>
                                </div>

                                <div className={styles['billing-card__right']}>
                                    <div className={styles['billing-card__amount']}>
                                        {activeTab === 'movimientos'
                                            ? `${item.type === 'CREDIT' ? '+' : '-'} $${Number(item.amount).toFixed(2)}`
                                            : `$${parseFloat(item.total).toFixed(2)}`
                                        }
                                    </div>

                                    {activeTab === 'historial' && (
                                        <div className={styles['billing-card__actions']}>
                                            <button className={styles['billing-card__btn']} onClick={() => onOpenInvoiceDetails(item)}>
                                                <FileText size={16} />
                                            </button>
                                            <button className={styles['billing-card__btn']} onClick={() => handleDownloadSingleInvoice(item.uid, item.invoiceNumber)}>
                                                <DownloadIcon size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
