import React from 'react';
import { Drawer } from '@mui/material';
import {
    X, Copy, ExternalLink, MapPin, Package,
    ChevronDown, ChevronUp, Check
} from 'lucide-react';
import styles from './ShipmentDetailsDrawer.module.scss';
import { formattedDateMex } from '../../../utils';
import { useShipmentDetails } from './hooks/useShipmentDetails';
import { IOrder } from '../../../types';
import { ShipmentDetailsSkeleton } from '../../ui/SkeletonUi/ShipmentDetailsSkeleton/ShipmentDetailsSkeleton';
import { getShipmentStatusInfo } from '../../../utils/shipmentStatus.utils';

interface ShipmentDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    shipmentData: IOrder | null;
}

export const ShipmentDetailsDrawer: React.FC<ShipmentDetailsDrawerProps> = ({ isOpen, onClose, shipmentData: initialData }) => {

    const {
        shipmentData,
        isLoading,
        error,
        openPackages,
        isCopied,
        togglePackage,
        handleCopy
    } = useShipmentDetails(initialData, isOpen);

    if (!initialData && !shipmentData) return null;

    const data = shipmentData || initialData;
    if (!data) return null;

    const statusInfo = getShipmentStatusInfo(data.status);

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: '100%',
                    maxWidth: { xs: '100dvw', sm: '42rem' },
                    height: '100dvh',
                    borderLeftWidth: '1px',
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: '#000c',
                },
            }}
        >
            <div className={styles['details-drawer']}>
                <button className={styles['details-drawer__close-btn']} onClick={onClose}>
                    <X size={18} />
                </button>
                {isLoading ? (
                    <ShipmentDetailsSkeleton />
                ) : (
                    <>
                        <header className={styles['details-drawer__header']}>
                            <div className={styles['details-drawer__header-content']}>
                                <img
                                    src={"https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png"}
                                    alt="logo"
                                    className={styles['details-drawer__app-logo']}
                                />
                                <div className={styles['details-drawer__title-group']}>
                                    <h2 className={styles['details-drawer__title']}>Detalles del envío</h2>
                                    <div className={styles['details-drawer__subtitle']}>
                                        <span>Orden {data.orderNumber}</span>
                                        <span className={styles['details-drawer__dot']}>•</span>
                                        <span>{formattedDateMex(data.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <div className={styles['details-drawer__body']}>

                            {error && (
                                <div className={styles['details-drawer__error']}>
                                    {error}
                                </div>
                            )}

                            <div className={styles['info-card']}>
                                <div className={styles['info-card__section']}>
                                    <div className={styles['info-card__row']}>
                                        <span className={styles['info-card__label']}>Paquetería</span>
                                        <span className={styles['info-card__value-bold']}>{data.quoteSelected?.carrierCode || data.carrier?.name}</span>
                                    </div>
                                    <div className={styles['info-card__row']}>
                                        <span className={styles['info-card__label']}>Número de rastreo</span>
                                        <button
                                            className={styles['info-card__tracking-btn']}
                                            onClick={() => handleCopy(data.trackingProvisional)}
                                        >
                                            {data.trackingProvisional}
                                            {isCopied ? <Check size={14} color="#22c55e" /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                    <div className={styles['info-card__row']}>
                                        <span className={styles['info-card__label']}>Entrega estimada</span>
                                        <span className={styles['info-card__value']}>2 día(s)</span>
                                    </div>
                                    <div className={styles['info-card__row']}>
                                        <span className={styles['info-card__label']}>Envío</span>
                                        <span className={styles['info-card__value']}>${data.totals?.taxes} MXN</span>
                                    </div>
                                    <div className={styles['info-card__row']}>
                                        <span className={styles['info-card__label']}>Seguro PawSafe</span>
                                        <span className={styles['info-card__value']}>${data.totals?.insurance} MXN</span>
                                    </div>
                                    <div className={`${styles['info-card__row']} ${styles['info-card__row--total']}`}>
                                        <span className={styles['info-card__label-bold']}>Total:</span>
                                        <span className={styles['info-card__amount-big']}>${data.totals?.grand} MXN</span>
                                    </div>
                                </div>

                                <div className={styles['info-card__tracker']}>
                                    <h3 className={styles['info-card__sub-title']}>Seguimiento del envío</h3>
                                    <p className={styles['info-card__update-text']}>Última actualización: {formattedDateMex(new Date().toISOString())}</p>
                                    <div className={`${styles['info-card__status-badge']} ${styles[`info-card__status-badge--${statusInfo.type}`]}`}>
                                        {statusInfo.dot} {statusInfo.label}
                                    </div>
                                    <a href="#" className={styles['info-card__link']}>
                                        <ExternalLink size={14} /> Rastrear en paquetería
                                    </a>
                                </div>
                            </div>

                            <div className={styles['info-card']}>
                                <div className={styles['info-card__grid']}>
                                    <div className={styles['address-block']}>
                                        <div className={styles['address-block__header']}>
                                            <MapPin size={16} /> <h3>Remitente</h3>
                                        </div>
                                        <div className={styles['address-block__content']}>
                                            <div className={styles['address-block__field']}>
                                                <p>Nombre</p> <span className={styles['text-dark']}>{data.originAddress?.fullName}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Teléfono</p> <span>{data.originAddress?.phone}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Correo</p> <span>{data.originAddress?.email}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Empresa</p> <span>{data.originAddress?.company || 'N/A'}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>RFC</p> <span>{data.originAddress?.rfc || 'N/A'}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Calle y número</p> <span>{data.originAddress?.addressLine} {data.originAddress?.interiorNumber ? `, Int. ${data.originAddress?.interiorNumber}` : ''}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Colonia</p> <span>{data.originAddress?.colony}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Código postal</p> <span>{data.originAddress?.postalCode}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Ciudad, Estado, País</p> <span>{data.originAddress?.city}, {data.originAddress?.state}, {data.originAddress?.country}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Referencia</p> <span>{data.originAddress?.references || 'Sin referencia'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles['address-block']}>
                                        <div className={styles['address-block__header']}>
                                            <MapPin size={16} /> <h3>Destinatario</h3>
                                        </div>
                                        <div className={styles['address-block__content']}>
                                            <div className={styles['address-block__field']}>
                                                <p>Nombre</p> <span className={styles['text-dark']}>{data.destinationAddress?.fullName}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Teléfono</p> <span>{data.destinationAddress?.phone}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Correo</p> <span>{data.destinationAddress?.email}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Empresa</p> <span>{data.destinationAddress?.company || 'N/A'}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Calle y número</p> <span>{data.destinationAddress?.addressLine} {data.destinationAddress?.interiorNumber ? `, Int. ${data.destinationAddress?.interiorNumber}` : ''}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Colonia</p> <span>{data.destinationAddress?.colony}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Código postal</p> <span>{data.destinationAddress?.postalCode}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Ciudad, Estado, País</p> <span>{data.destinationAddress?.city}, {data.destinationAddress?.state}, {data.destinationAddress?.country}</span>
                                            </div>
                                            <div className={styles['address-block__field']}>
                                                <p>Referencia</p> <span>{data.destinationAddress?.references || 'Sin referencia'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {data.packages?.map((pkg, index) => (
                                <div className={styles['info-card']} key={index}>
                                    <div className={styles['package-block']}>
                                        <div className={styles['package-block__header']}>
                                            <Package size={16} />
                                            <h3>{pkg.alias || `Paquete ${(data.packages?.length || 0) > 1 ? index + 1 : ''}`}</h3>
                                        </div>
                                        <div className={styles['package-block__details']}>
                                            <div className={styles['package-block__field']}>
                                                <p>Dimensiones (Largo × Ancho × Alto):</p>
                                                <span>
                                                    {pkg.lengthCm} × {pkg.widthCm} × {pkg.heightCm} cm
                                                </span>
                                            </div>
                                            <div className={styles['package-block__field']}>
                                                <p>Peso:</p>
                                                <span>{pkg.weightKg} kg</span>
                                            </div>
                                            <div className={styles['package-block__field']}>
                                                <p>Tipo de producto:</p>
                                                <span>{pkg.productType || 'Sin tipo de producto'}</span>
                                            </div>
                                        </div>

                                        <div className={styles['package-block__divider']} />

                                        <button
                                            className={styles['package-block__toggle']}
                                            onClick={() => togglePackage(index)}
                                        >
                                            <span>Productos ({pkg.items?.length || 0} productos)</span>
                                            {openPackages[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </button>

                                        {openPackages[index] && (
                                            <div className={styles['package-block__product-list']}>
                                                {pkg.items && pkg.items.length > 0 ? (
                                                    pkg.items.map((prod, idx) => (
                                                        <div key={prod.id || idx} className={styles['package-block__product-item']}>
                                                            <div className={styles['package-block__product-header']}>
                                                                <p className={styles['package-block__product-name']}>
                                                                    {prod.name || `Producto ${idx + 1}`}
                                                                </p>
                                                                <span className={styles['package-block__product-qty']}>x{prod.quantity}</span>
                                                            </div>
                                                            <div className={styles['package-block__product-meta']}>
                                                                <p className={styles['package-block__product-detail']}>
                                                                    SKU: {prod.sku || 'N/A'}
                                                                </p>
                                                                <p className={styles['package-block__product-price']}>
                                                                    ${prod.unitPrice} MXN
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className={styles['package-block__no-products']}>
                                                        <p>No hay productos registrados en este paquete.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                        </div>
                    </>
                )}

            </div>
        </Drawer>
    );
};

export default ShipmentDetailsDrawer;