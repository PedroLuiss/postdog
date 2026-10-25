import React from 'react';
import { SavedAddresses } from '../../components/SavedAddresses/SavedAddresses';
import { useSavedAddressesPage } from '../../hooks/useSavedAddressesPage';
import { AddAddressModal } from '../../components/AddAddressModal/AddAddressModal';
import { useAddAddress } from '../../hooks/useAddAddress';
import { AlertDialogUi } from '../../components/ui/AlertDialogUi/AlertDialogUi';

export const DirectionsPage = () => {
    const {
        handleSaveAddress,
        addressToEdit,
        handleCloseModal,
        addressToDelete,
        confirmDeleteAddress,
        cancelDelete,
        ...pageProps
    } = useSavedAddressesPage();
    const addAddressHook = useAddAddress({
        onSave: handleSaveAddress,
        initialData: addressToEdit
    });

    const handleClose = () => {
        addAddressHook.closeModal();
        handleCloseModal();
    };

    return (
        <div>
            <SavedAddresses
                onAddAddress={addAddressHook.openModal}
                {...pageProps}
            />
            <AddAddressModal
                onClose={handleClose}
                hookData={addAddressHook}
            />
            <AlertDialogUi
                isOpen={!!addressToDelete}
                onClose={cancelDelete}
                onConfirm={confirmDeleteAddress}
                title="Eliminar dirección"
                description="¿Estás seguro de que deseas eliminar esta dirección? Esta acción no se puede deshacer."
                confirmLabel="Confirmar"
                cancelLabel="Cancelar"
            />
        </div>
    );
};
