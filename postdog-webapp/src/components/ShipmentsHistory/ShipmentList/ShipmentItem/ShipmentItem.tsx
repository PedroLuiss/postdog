import { Copy, Truck, Package, Download, Eye, EllipsisVertical, Check, RotateCcw, Files, CircleX, CircleHelp, ShieldCheck } from 'lucide-react';
import styles from './ShipmentItem.module.scss';
import ButtonUi from '../../../ui/Button/ButtonUi';
import { formattedDateMex } from '../../../../utils';
import { CancelShipmentDrawer } from '../../CancelShipmentModalDrawer/CancelShipmentDrawer';

import { ShipmentDetailsDrawer } from '../../ShipmentDetailsModalDrawer/ShipmentDetailsDrawer';
import { useShipmentItem } from './hooks/useShipmentItem';
import { AddInsuranceDrawer } from '../../AddInsuranceDrawer/AddInsuranceDrawer';
import { useNavigate } from 'react-router-dom';
import { IOrder } from '../../../../types';
import { ImgUi } from '../../../ui/ImgUi/ImgUi';

interface ShipmentItemProps {
    data: IOrder;
    isSelected: boolean;
    onSelect: () => void;
    onRefresh?: () => void;
}

const ShipmentItem: React.FC<ShipmentItemProps> = ({ data, isSelected, onSelect, onRefresh }) => {
    const navigate = useNavigate();
    const {
        isActionsOpen,
        isCancelModalOpen,
        isDetailsModalOpen,
        isDownloadingLabel,
        isDuplicating,
        isCreatingReturn,
        isCancelled,
        statusInfo,
        setIsActionsOpen,
        setIsCancelModalOpen,
        setIsDetailsModalOpen,
        handleCreateReturn,
        handleDuplicate,
        handleCopyTracking,
        handleDownloadLabel,
        menuRefDesktop,
        menuRefMobile,
        isInsuranceModalOpen,
        setIsInsuranceModalOpen
    } = useShipmentItem(data, styles);

    return (
        <div className={styles['shipment-card']}>

            <div className={styles['shipment-card__desktop']}>
                <div className={styles['shipment-card__header']}>
                    <div className={styles['shipment-card__header-left']}>
                        <div
                            className={`${styles['shipment-card__checkbox']} ${isSelected ? styles['shipment-card__checkbox--checked'] : ''}`}
                            onClick={onSelect}
                        >
                            {isSelected && <Check size={12} strokeWidth={4} />}
                        </div>
                        <ImgUi src={data.appLogo || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png"} alt="logo" className={styles['shipment-card__app-logo']} />
                        <div className={styles['shipment-card__info-main']}>
                            <div className={styles['shipment-card__id-row']}>
                                <span className={styles['shipment-card__order-id']}>{data.orderNumber}</span>
                                {!isCancelled && (statusInfo.label === 'Pendiente de envío' || statusInfo.label === 'En camino') && (
                                    data.totals.insurance !== "0.00" ? (
                                        <div className={styles['shipment-card__badge-purple']}>
                                            Tu envío ya está asegurado con PawSafe (${data.totals.insurance})
                                        </div>
                                    ) : (
                                        <div className={styles['shipment-card__badge-action']}   onClick={() => setIsInsuranceModalOpen(true)}>
                                            Tu envío no está asegurado, <span className={styles['shipment-card__underline']}>agrega PawSafe ahora</span>
                                        </div>
                                    )
                                )}
                            </div>
                            <span className={styles['shipment-card__date']}>{formattedDateMex(data.createdAt)}</span>
                        </div>
                    </div>
                    <span className={statusInfo.className}>
                        {statusInfo.dot} {statusInfo.label}
                    </span>
                </div>

                <div className={styles['shipment-card__grid']}>
                    <div className={styles['shipment-card__col']}>
                        <label className={styles['shipment-card__label']}>Paquetería</label>
                        <div className={styles['shipment-card__carrier-logo-wrapper']}>
                            <img src={data.quoteSelected.logoUrl} alt="Carrier" />
                        </div>
                        <div className={styles['shipment-card__carrier-name']}>
                            {data.quoteSelected.carrierCode} {data?.quoteSelected?.serviceName}
                        </div>
                    </div>

                    <div className={styles['shipment-card__col']}>
                        <label className={styles['shipment-card__label']}>Número de rastreo</label>
                        <button className={styles['shipment-card__tracking-btn']} onClick={handleCopyTracking}>
                            {data.trackingProvisional} <Copy size={16} />
                        </button>
                    </div>

                    <div className={styles['shipment-card__col']}>
                        <label className={styles['shipment-card__label']}>Destino</label>
                        <div className={styles['shipment-card__dest-name']}>{data.destinationAddress.fullName}</div>
                        <div className={styles['shipment-card__dest-zip']}>
                            {data.destinationAddress.postalCode} - {data.destinationAddress.city}
                        </div>
                    </div>

                    <div className={styles['shipment-card__col']}>
                        <label className={styles['shipment-card__label']}>Entrega estimada</label>
                        <div className={styles['shipment-card__text-base']}>2 día(s)</div>
                    </div>

                    <div className={styles['shipment-card__col']}>
                        <label className={styles['shipment-card__label']}>Precio</label>
                        <div className={styles['shipment-card__price-text']}>${data.totals.grand}</div>
                    </div>
                </div>

                <div className={styles['shipment-card__footer']}>
                    <div className={styles['shipment-card__tags']}>
                        <div className={`${styles['shipment-card__tag']} ${!data.quoteSelected.pickupAvailable ? styles['shipment-card__tag--disabled'] : ''}`} >
                            <div className={`${styles['shipment-card__tag-icon']} ${!data.quoteSelected.pickupAvailable ? styles['shipment-card__tag-icon--disabled-icon'] : ''}`}><Truck size={14} /></div>
                            <span>Recolección</span>
                        </div>
                        <div className={`${styles['shipment-card__tag']} ${!data.quoteSelected.trackingAvailable ? styles['shipment-card__tag--disabled'] : ''}`}>
                            <div className={`${styles['shipment-card__tag-icon']}  ${!data.quoteSelected.trackingAvailable ? styles['shipment-card__tag-icon--disabled-icon'] : ''}`}><Package size={14} /></div>
                            <span>Rastreo</span>
                        </div>
                        <div className={`${styles['shipment-card__tag']} ${!data.quoteSelected.thermalPrintingAvailable ? styles['shipment-card__tag--disabled'] : ''}`}>
                            <div className={`${styles['shipment-card__tag-icon']} ${!data.quoteSelected.thermalPrintingAvailable ? styles['shipment-card__tag-icon--disabled-icon'] : ''}`}><Download size={14} /></div>
                            <span>Impresión térmica</span>
                        </div>
                    </div>

                    <div className={styles['shipment-card__actions-group']}>
                        <ButtonUi
                            variant="light"
                            className={styles['shipment-card__action-btn']}
                            onClick={() => setIsDetailsModalOpen(true)}
                        >
                            <Eye size={16} />
                        </ButtonUi>
                        {!isCancelled && (
                            <ButtonUi 
                                variant="light" 
                                className={styles['shipment-card__action-btn']}
                                onClick={handleDownloadLabel}
                                isLoading={isDownloadingLabel}
                            >
                                <Download size={16} />
                            </ButtonUi>
                        )}
                        <div className={styles['action-menu']} ref={menuRefDesktop}>
                            <ButtonUi
                                variant="light"
                                className={styles['shipment-card__action-btn']}
                                onClick={() => setIsActionsOpen(!isActionsOpen)}
                            >
                                <EllipsisVertical size={16} />
                            </ButtonUi>

                            {isActionsOpen && (
                                <div className={styles['action-menu__dropdown']}>
                                    {(statusInfo.label === 'Pendiente de envío' || statusInfo.label === 'En camino' || statusInfo.label === 'Cancelado' || statusInfo.label === 'Entregado') && (
                                        <>
                                            <div 
                                                className={`${styles['action-menu__item']} ${isCreatingReturn ? styles['action-menu__item--disabled'] : ''}`} 
                                                onClick={!isCreatingReturn ? handleCreateReturn : undefined}
                                            >
                                                <RotateCcw size={16} /> <span>{isCreatingReturn ? 'Cargando...' : 'Crear retorno'}</span>
                                            </div>
                                            <div 
                                                className={`${styles['action-menu__item']} ${isDuplicating ? styles['action-menu__item--disabled'] : ''}`} 
                                                onClick={!isDuplicating ? handleDuplicate : undefined}
                                            >
                                                <Files size={16} /> <span>{isDuplicating ? 'Duplicando...' : 'Duplicar'}</span>
                                            </div>
                                        </>
                                    )}

                                    {statusInfo.label === 'Pendiente de envío' && (
                                        <div className={styles['action-menu__item']} onClick={() => { setIsCancelModalOpen(true); setIsActionsOpen(false); }}>
                                            <CircleX size={16} /> <span>Cancelar envío</span>
                                        </div>
                                    )}

                                    {(statusInfo.label === 'Pendiente de envío' || statusInfo.label === 'En camino') && (data.totals.insurance === "0.00" ) && (
                                        <div className={styles['action-menu__item']} onClick={() => setIsInsuranceModalOpen(true)}>
                                            <ShieldCheck size={16} /> <span>Agregar seguro</span>
                                        </div>
                                    )}

                                    <div className={styles['action-menu__item']} onClick={() => { navigate('/help'); }}>
                                        <CircleHelp size={16} /> <span>Ayuda</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles['shipment-card__mobile']}>
                <div className={styles['shipment-card__mobile-header']}>
                    <div
                        className={`${styles['shipment-card__checkbox']} ${isSelected ? styles['shipment-card__checkbox--checked'] : ''}`}
                        onClick={onSelect}
                    >
                        {isSelected && <Check size={12} strokeWidth={4} />}
                    </div>

                    <div className={styles['shipment-card__mobile-content']}>
                        <div className={styles['shipment-card__mobile-row-top']}>
                            <img
                                src={data.appLogo || "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png"}
                                alt="app-logo"
                                className={styles['shipment-card__mobile-app-logo']}
                            />
                            <span className={styles['shipment-card__mobile-order-id']}>
                                {data.orderNumber}
                            </span>
                            <div className={`${styles['shipment-card__mobile-status']} ${statusInfo.className}`}>
                                {statusInfo.dot}
                            </div>
                        </div>

                        <div className={styles['shipment-card__mobile-date']}>
                            {formattedDateMex(data.createdAt)}
                        </div>

                        <div className={styles['shipment-card__mobile-insurance-container']}>
                            {!isCancelled && (statusInfo.label === 'Pendiente de envío' || statusInfo.label === 'En camino') && (
                                data.totals.insurance !== "0.00" ? (
                                    <div className={styles['shipment-card__badge-purple']}>
                                        Asegurado con PawSafe (${data.totals.insurance})
                                    </div>
                                ) : (
                                    <div className={styles['shipment-card__badge-action']} onClick={() => setIsInsuranceModalOpen(true)}>
                                        Asegura tu envío con <span className={styles['shipment-card__underline']}>PawSafe ahora</span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles['shipment-card__mobile-grid']}>
                    <div className={styles['shipment-card__mobile-col']}>
                        <div className={styles['shipment-card__mobile-label']}>Paquetería</div>
                        <img
                            src={data.quoteSelected.logoUrl}
                            alt="Carrier"
                            className={styles['shipment-card__mobile-carrier-logo']}
                        />
                    </div>
                    <div className={`${styles['shipment-card__mobile-col']} ${styles['shipment-card__mobile-col--right']}`}>
                        <div className={styles['shipment-card__mobile-label']}>Precio</div>
                        <div className={styles['shipment-card__mobile-price']}>${data.totals.grand}</div>
                    </div>
                    <div className={`${styles['shipment-card__mobile-col']} ${styles['shipment-card__mobile-col--span-2']}`}>
                        <div className={styles['shipment-card__mobile-label']}>Número de rastreo</div>
                        <button className={styles['shipment-card__mobile-tracking-btn']} onClick={handleCopyTracking}>
                            <span>{data.trackingProvisional}</span>
                            <Copy size={16} />
                        </button>
                    </div>
                    <div className={`${styles['shipment-card__mobile-col']} ${styles['shipment-card__mobile-col--span-2']}`}>
                        <div className={styles['shipment-card__mobile-label']}>Destino</div>
                        <div className={styles['shipment-card__mobile-dest-name']}>
                            {data.destinationAddress.fullName}
                        </div>
                        <div className={styles['shipment-card__mobile-dest-info']}>
                            {data.destinationAddress.postalCode} - {data.destinationAddress.city}
                        </div>
                    </div>
                </div>

                <div className={styles['shipment-card__mobile-actions']}>
                    <div className={styles['action-menu']} ref={menuRefMobile}>
                        <ButtonUi
                            onClick={() => setIsActionsOpen(!isActionsOpen)}
                            variant="light"
                            fullWidth
                            className={styles['shipment-card__mobile-btn-trigger']}
                        >
                            <EllipsisVertical size={16} />
                            <span>Acciones</span>
                        </ButtonUi>

                        {isActionsOpen && (
                            <div className={styles['action-menu__dropdown']}>
                                <div className={styles['action-menu__item']} onClick={() => { setIsDetailsModalOpen(true); setIsActionsOpen(false); }}>
                                    <Eye size={16} /> <span>Ver detalles</span>
                                </div>
                                {!isCancelled && (
                                    <div 
                                        className={`${styles['action-menu__item']} ${isDownloadingLabel ? styles['action-menu__item--disabled'] : ''}`}
                                        onClick={!isDownloadingLabel ? handleDownloadLabel : undefined}
                                    >
                                        <Download size={16} /> <span>{isDownloadingLabel ? 'Descargando...' : 'Descargar guía'}</span>
                                    </div>
                                )}
                                
                                {(statusInfo.label === 'Pendiente de envío' || statusInfo.label === 'En camino' || statusInfo.label === 'Cancelado' || statusInfo.label === 'Entregado') && (
                                    <>
                                        <div 
                                            className={`${styles['action-menu__item']} ${isCreatingReturn ? styles['action-menu__item--disabled'] : ''}`}
                                            onClick={!isCreatingReturn ? handleCreateReturn : undefined}
                                        >
                                            <RotateCcw size={16} /> <span>{isCreatingReturn ? 'Cargando...' : 'Crear retorno'}</span>
                                        </div>
                                        <div 
                                            className={`${styles['action-menu__item']} ${isDuplicating ? styles['action-menu__item--disabled'] : ''}`}
                                            onClick={!isDuplicating ? handleDuplicate : undefined}
                                        >
                                            <Files size={16} /> <span>{isDuplicating ? 'Duplicando...' : 'Duplicar'}</span>
                                        </div>
                                    </>
                                )}

                                {statusInfo.label === 'Pendiente de envío' && (
                                    <div className={styles['action-menu__item']} onClick={() => { setIsCancelModalOpen(true); setIsActionsOpen(false); }}>
                                        <CircleX size={16} /> <span>Cancelar envío</span>
                                    </div>
                                )}

                                {(statusInfo.label === 'Pendiente de envío' || statusInfo.label === 'En camino') && (data.totals.insurance === "0.00") && (
                                    <div className={styles['action-menu__item']} onClick={() => setIsInsuranceModalOpen(true)}>
                                        <ShieldCheck size={16} /> <span>Agregar seguro</span>
                                    </div>
                                )}

                                <div className={styles['action-menu__item']} onClick={() => { navigate('/help'); }}>
                                    <CircleHelp size={16} /> <span>Ayuda</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <CancelShipmentDrawer
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                shipmentData={data}
                onSuccess={onRefresh}
            />
            <ShipmentDetailsDrawer
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                shipmentData={data}
            />

            <AddInsuranceDrawer 
                isOpen={isInsuranceModalOpen}
                onClose={() => setIsInsuranceModalOpen(false)}
                shipmentData={data}
                onSuccess={onRefresh}
            />
        </div>
    );
};

export default ShipmentItem;