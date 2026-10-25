import React from 'react';
import { FileText, Download, ChevronDown, ChevronUp, X } from 'lucide-react';
import DrawerModalUi from '../../../ui/DrawerUi/DrawerModalUi';
import { Invoice } from '../../Type/Billing.Type';
import styles from './InvoiceDetailsModal.module.scss';
import { useInvoiceDetails } from './hooks/useInvoiceDetails';

interface InvoiceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoice: Invoice | null;
    onDownload: (invoiceId: string, invoiceNumber?: string) => Promise<void>;
}

export const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
    isOpen,
    onClose,
    invoice,
    onDownload
}) => {
    const {
        movements,
        isLoadingMovements,
        isMovementsExpanded,
        setIsMovementsExpanded,
        formattedDate
    } = useInvoiceDetails({ isOpen, invoice });

    if (!invoice) return null;

    const dateStr = formattedDate(invoice.createdAt);

    const headerNode = (
        <div className={styles['modal-header']}>
            <div className={styles['modal-header__main-container']}>
                <div className={styles['modal-header__brand']}>
                    <div className={styles['brand-icon']}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className={styles['brand-title']}>Detalles de la factura</h2>
                        <div className={styles['brand-date']}>{dateStr}</div>
                    </div>
                </div>
                <button className={styles['modal-header__close-btn']} onClick={onClose}>
                    <X size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <DrawerModalUi
            isOpen={isOpen}
            onClose={onClose}
            headerNode={headerNode}
            maxWidth="656px"
            maxWidthLg="656px"
            showCloseButton={false}
        >
            <div className={styles['modal-body']}>

                <div className={styles['card-info']}>
                    <div className={styles['card-info__header']}>
                        <div className={styles['title-wrapper']}>
                            <FileText size={16} />
                            Factura {invoice.invoiceNumber}
                        </div>
                        <span className={styles['badge-success']}>Facturado</span>
                    </div>

                    <div className={styles['card-info__grid']}>
                        <div className={styles['card-info__group']}>
                            <span className={styles['label']}>RFC</span>
                            <span className={styles['value-text']}>{invoice.fiscalSnapshot.rfc}</span>
                        </div>
                        <div className={styles['card-info__group']}>
                            <span className={styles['label']}>Fecha</span>
                            <span className={styles['value-text']}>{dateStr}</span>
                        </div>
                        <div className={styles['card-info__group']}>
                            <span className={styles['label']}>Moneda</span>
                            <span className={styles['value']}>{invoice.currency}</span>
                        </div>
                        <div className={styles['card-info__group']}>
                            <span className={styles['label']}>Subtotal</span>
                            <span className={styles['value']}>${parseFloat(invoice.subtotal).toFixed(2)}</span>
                        </div>
                        <div className={styles['card-info__group']}>
                            <span className={styles['label']}>Impuestos trasladados</span>
                            <span className={styles['value']}>${parseFloat(invoice.taxAmount).toFixed(2)}</span>
                        </div>
                        <div className={styles['card-info__group']}>
                            <span className={styles['label']}>IVA 16.0000%</span>
                            <span className={styles['value-text']}>-</span>
                        </div>
                    </div>

                    <div className={styles['card-info__total-section']}>
                        <div className={styles['total-box']}>
                            <span className={styles['total-label']}>Total facturado:</span>
                            <span className={styles['total-amount']}>${parseFloat(invoice.total).toFixed(2)} MXN</span>
                        </div>
                    </div>

                    <button
                        className={styles['btn-download']}
                        onClick={() => onDownload(invoice.uid, invoice.invoiceNumber)}
                    >
                        <Download size={16} /> Descargar factura
                    </button>
                </div>

                <div className={styles['card-info']}>
                    <div className={`${styles['card-info__header']} ${styles['mb-16']}`}>
                        <div className={styles['title-wrapper']}>
                            <FileText size={16} />
                            Datos del emisor
                        </div>
                    </div>

                    <div className={`${styles['card-info__group']} ${styles['mb-16']}`}>
                        <span className={styles['label']}>RFC</span>
                        <span className={styles['value-text']}>POS251011DE8</span>
                    </div>
                    <div className={styles['card-info__group']}>
                        <span className={styles['label']}>Nombre</span>
                        <span className={styles['value-text']}>Postdog</span>
                    </div>
                </div>

                <div className={styles['card-info']}>
                    <div className={`${styles['card-info__header']} ${styles['mb-16']}`}>
                        <div className={styles['title-wrapper']}>
                            <FileText size={16} />
                            Datos del receptor
                        </div>
                    </div>

                    <div className={`${styles['card-info__group']} ${styles['mb-16']}`}>
                        <span className={styles['label']}>RFC</span>
                        <span className={styles['value-text']}>{invoice.fiscalSnapshot.rfc}</span>
                    </div>
                    <div className={`${styles['card-info__group']} ${styles['mb-16']}`}>
                        <span className={styles['label']}>Nombre / Razón social</span>
                        <span className={styles['value-text']}>{invoice.fiscalSnapshot.businessName}</span>
                    </div>
                    <div className={styles['card-info__group']}>
                        <span className={styles['label']}>Código postal | Régimen fiscal | Uso de CFDI</span>
                        <span className={styles['value-text']}>
                            {invoice.fiscalSnapshot.postalCode} | {invoice.fiscalSnapshot.taxRegime} | {invoice.fiscalSnapshot.cfdiUse}
                        </span>
                    </div>
                </div>

                <div className={styles['table-container']}>
                    <details
                        open={isMovementsExpanded}
                        onToggle={(e) => setIsMovementsExpanded(e.currentTarget.open)}
                        className={styles['w-full']}
                    >
                        <summary className={styles['table-container__trigger']}>
                            <div className={styles['title']}>
                                <FileText size={16} />
                                Resumen de movimientos
                            </div>
                            {isMovementsExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
                        </summary>

                        <div className={styles['table-container__content']}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Movimiento</th>
                                        <th className={styles['text-right']}>Cantidad</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoadingMovements ? (
                                        <tr>
                                            <td colSpan={2} className={styles['text-center-muted']}>Cargando movimientos...</td>
                                        </tr>
                                    ) : movements.length > 0 ? (
                                        movements.map((mov) => (
                                            <tr key={mov.uid}>
                                                <td>
                                                    {mov.uiConcept || mov.referenceType || 'Movimiento'}
                                                    <span className={styles['sub-info']}>
                                                        {mov.uiDescription || mov.referenceId || mov.uid.split('-')[0]}
                                                    </span>
                                                </td>
                                                <td className={styles['text-right']}>
                                                    ${Number(mov.amount).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={2} className={styles['text-center-muted']}>No se encontraron movimientos para esta factura.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </details>
                </div>

            </div>
        </DrawerModalUi>
    );
};
