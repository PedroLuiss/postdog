import React from 'react';
import { Drawer, Box, Alert } from '@mui/material';
import styles from './FinalizeShippingModal.module.scss';

import { useShippingQuoteDrawer } from '../../context';
import { useFinalizeShipping } from '../../hooks/useFinalizeShipping';

import { FinalizeShippingHeader } from './FinalizeShippingHeader';
import { AddressSection } from './AddressSection';
import { PackagesSection } from './PackagesSection';
import { ParcelSection } from './ParcelSection';
import { PaymentDetails } from '../ShippingQuote/Steps/Three/PaymentDetails/PaymentDetails';
import { ErrorMessage } from '../ui/ErrorMessage/ErrorMessage';
import { CheckCircleOutline } from '@mui/icons-material';

export const FinalizeShippingModal: React.FC = () => {
    const { isDrawerOpenEditOrder, closeDrawerEditOrde, order } = useShippingQuoteDrawer();

    const {
        isEditingAddress,
        editingPackageId,
        isEditingCourier,
        isPawSafeActive,
        remitterData,
        addresseeData,
        remitterErrors,
        addresseeErrors,
        remitterColonies,
        addresseeColonies,
        isLoadingRemitterZip,
        isLoadingAddresseeZip,
        packages,
        packageErrors,
        filteredAndSortedOptions,
        selectedOption,
        sortConfig,
        paymentErrors,
        declaredValue,
        addressHandlers,
        packageHandlers,
        courierHandlers,
        handleSend,
        setIsPawSafeActive,
        setDeclaredValue,
        isUpdating,
        updateError,
        dataUpdateShipmentModal
    } = useFinalizeShipping({ order, isOpen: isDrawerOpenEditOrder, closeDrawerEditOrde });

    return (
        <Drawer anchor="right" open={isDrawerOpenEditOrder} onClose={closeDrawerEditOrde} sx={{ '& .MuiDrawer-paper': { width: '100%', maxWidth: '850px', height: '100dvh', boxSizing: 'border-box' } }}>
            <Box className={styles['finalize-shipping']}>
                <FinalizeShippingHeader onSave={handleSend} loading={isUpdating} onClose={closeDrawerEditOrde} />

                <main className={styles['finalize-shipping__main']}>
                    {updateError && (
                        <ErrorMessage message={`Error al guardar: ${updateError}`} title='Error' />

                    )}

                    {dataUpdateShipmentModal && (
                        <Alert icon={<CheckCircleOutline fontSize="inherit" />} className='mb-2' severity="success">
                            {dataUpdateShipmentModal.message}
                        </Alert>
                    )}
                    <AddressSection
                        isEditing={isEditingAddress}
                        remitterData={remitterData}
                        addresseeData={addresseeData}
                        remitterErrors={remitterErrors}
                        addresseeErrors={addresseeErrors}
                        remitterColonies={remitterColonies}
                        addresseeColonies={addresseeColonies}
                        isLoadingRemitterZip={isLoadingRemitterZip}
                        isLoadingAddresseeZip={isLoadingAddresseeZip}
                        handlers={addressHandlers}
                    />
                    <PackagesSection
                        packages={packages}
                        editingPackageId={editingPackageId}
                        packageErrors={packageErrors}
                        handlers={packageHandlers}
                    />
                    <ParcelSection
                        isEditing={isEditingCourier}
                        options={filteredAndSortedOptions}
                        selectedOption={selectedOption}
                        sortConfig={sortConfig}
                        handlers={courierHandlers}
                    />

                    <PaymentDetails
                        shippingCost={selectedOption?.price || 0}
                        error={paymentErrors.declaredValue}
                        isPawSafeActive={isPawSafeActive}
                        onPawSafeToggle={setIsPawSafeActive}
                        declaredValue={declaredValue}
                        onDeclaredValueChange={setDeclaredValue}
                        handleSend={handleSend}
                        loading={isUpdating}
                    />
                </main>
            </Box>
        </Drawer>
    );
};