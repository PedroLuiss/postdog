import React from 'react';
import {
    MapPin,
    User,
    Package as PackageIcon,
} from 'lucide-react';
import styles from './CreateShipmentDrawer.module.scss';
import ShipmentCard from './components/ShipmentCard';
import RemitterForm from './components/RemitterForm';
import AddresseeForm from './components/AddresseeForm';
import PackageMain from './components/PackageMain';
import PackageInfoCard from './components/PackageInfoCard';
import AddresseeInfoCard from './components/AddresseeInfoCard';
import RemitterInfoCard from './components/RemitterInfoCard';
import { QuotationProcessShipping } from './components/QuotationProcessShipping/QuotationProcessShipping';

import { QuoteFormData } from '../../types';
import { OrderSummaryBanner } from './components/OrderSummaryBanner';
import { FormattedDateUtils } from '../../utils/FormattedDate.utils';


import { useCreateShipmentDrawer } from './hooks/useCreateShipmentDrawer';
import DrawerModalUi from '../ui/DrawerUi/DrawerModalUi';


interface CreateShipmentDrawerProps {
    initialQuoteData?: QuoteFormData;
    onSuccess?: () => void;
}

export const CreateShipmentDrawer: React.FC<CreateShipmentDrawerProps> = ({ initialQuoteData, onSuccess }) => {
    const {
        state,
        isModalCreateShipmentOpen,
        closeModalCreateShipment,
        clearRemitter,
        clearAddressee,
        isRemitterEditing,
        setIsRemitterEditing,
        isAddresseeEditing,
        setIsAddresseeEditing,
        isPackageEditing,
        setIsPackageEditing,
        handleRemitterAddressSelected,
        handleAddresseeAddressSelected,
        handlePackageSelected
    } = useCreateShipmentDrawer(initialQuoteData);


    return (
        <DrawerModalUi
            isOpen={isModalCreateShipmentOpen}
            onClose={closeModalCreateShipment}
            maxWidth="1200px"
            title="Crear envío"
        >

            {state.shippingType === 'from_order' && state.selectedOrder && (
                <OrderSummaryBanner
                    orderNumber={`${state.selectedOrder.orderNumber}`}
                    date={FormattedDateUtils(state.selectedOrder.createdAt)}
                    shipmentType={
                        state.selectedOrder.quoteCarrier?.carrierName
                            ? `${state.selectedOrder.quoteCarrier.carrierName.toUpperCase()} (${state.selectedOrder.quoteCarrier.deliveryDaysMin || 0}-${state.selectedOrder.quoteCarrier.deliveryDaysMax || 0} DÍAS)`
                            : 'PAGO POR SISTEMA'
                    }
                    total={`$${state.selectedOrder.quoteCarrier?.price || '0.00'}`}
                    logoUrl={state.selectedOrder.source?.logoUrl}
                />
            )}

            <div className={styles['create-shipment-drawer__content']}>

                <div className={styles['create-shipment-drawer__form-section']}>

                    <ShipmentCard
                        icon={<MapPin />}
                        title="Remitente"
                        isEditing={isRemitterEditing}
                        onToggleEdit={() => setIsRemitterEditing(!isRemitterEditing)}
                        onClear={clearRemitter}
                        className={isRemitterEditing ? styles['create-shipment-drawer__shipment-card--editing'] : styles['create-shipment-drawer__shipment-card']}
                    >
                        {isRemitterEditing ? (
                            <RemitterForm onAddressSelected={handleRemitterAddressSelected} />
                        ) : (
                            <RemitterInfoCard />
                        )}
                    </ShipmentCard>

                    <ShipmentCard
                        icon={<User />}
                        title="Destinatario"
                        isEditing={isAddresseeEditing}
                        onToggleEdit={() => setIsAddresseeEditing(!isAddresseeEditing)}
                        onClear={clearAddressee}
                    >
                        {isAddresseeEditing ? (
                            <AddresseeForm onAddressSelected={handleAddresseeAddressSelected} />
                        ) : (
                            <AddresseeInfoCard />
                        )}
                    </ShipmentCard>

                    <ShipmentCard
                        icon={<PackageIcon />}
                        title="Paquete"
                        isEditing={isPackageEditing}
                        onToggleEdit={() => setIsPackageEditing(!isPackageEditing)}
                    >
                        {isPackageEditing ? (
                            <PackageMain onPackageSelected={handlePackageSelected} />
                        ) : (
                            <PackageInfoCard />
                        )}
                    </ShipmentCard>

                </div>

                <aside className={styles['create-shipment-drawer__summary-section']}>
                    <div className={styles['create-shipment-drawer__sticky-summary']}>
                        <QuotationProcessShipping onSuccess={onSuccess} />
                    </div>
                </aside>

            </div>
        </DrawerModalUi>
    );
};
