import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSavedAddresses, clearAddressCache } from './useSavedAddresses';
import AddressServices from '../services/AddressService';
import { DataSaveAddress, } from '../types';
import { AddAddressFormData } from '../types/addAddress.type';
import { useNotification } from '../context/NotificationContext';

export const useSavedAddressesPage = () => {
    const { addresses: initialAddresses, isLoading, error, refetch } = useSavedAddresses();
    const [localAddresses, setLocalAddresses] = useState<DataSaveAddress[]>([]);
    const { showNotification } = useNotification();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setLocalAddresses(initialAddresses);
    }, [initialAddresses]);
    const [selectedLabel, setSelectedLabel] = useState<'Origen' | 'Destino' | 'Ambas' | ''>('');
    const [addressToEdit, setAddressToEdit] = useState<DataSaveAddress | null>(null);
    const [addressToDelete, setAddressToDelete] = useState<DataSaveAddress | null>(null);

    const handleEditAddress = (address: DataSaveAddress) => {
        setAddressToEdit(address);
    };

    const handleCloseModal = () => {
        setAddressToEdit(null);
    };

    const filteredAddresses = useMemo(() => {
        const filtered = localAddresses.filter(addr => {
            const matchesSearch =
                addr.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                addr.addressLine.toLowerCase().includes(searchTerm.toLowerCase()) ||
                addr.fullName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLabel = !selectedLabel ||
                (selectedLabel === 'Origen' && (addr.type === 'origin' || addr.type === 'both')) ||
                (selectedLabel === 'Destino' && (addr.type === 'destination' || addr.type === 'both')) ||
                (selectedLabel === 'Ambas' && addr.type === 'both');

            return matchesSearch && matchesLabel;
        });

        return [...filtered].sort((a, b) => {
            if (a.isFavorite && !b.isFavorite) return -1;
            if (!a.isFavorite && b.isFavorite) return 1;
            return 0;
        });
    }, [localAddresses, searchTerm, selectedLabel]);

    const handleSaveAddress = useCallback(async (formData: AddAddressFormData): Promise<boolean> => {
        try {
            const payload = {
                type: formData.label === 'Origen' ? 'origin' : (formData.label === 'Destino' ? 'destination' : 'both') as any,
                alias: formData.alias,
                addressLine: formData.addressLine,
                interiorNumber: formData.interiorNumber,
                postalCode: formData.postalCode,
                colony: formData.colony,
                city: formData.city,
                state: formData.state,
                country: 'MX',
                references: formData.references,
                fullName: formData.fullName,
                phone: formData.phone.replace(/\s+/g, ''),
                email: formData.email,
                company: formData.company,
                rfc: formData.rfc
            };

            if (addressToEdit) {
                await AddressServices.updateAddressService(addressToEdit.uid || addressToEdit.id, payload);
                showNotification('Dirección guardada', 'Dirección actualizada con éxito', 'success');
            } else {
                await AddressServices.addAddressService(payload);
                showNotification('Dirección guardada', 'La dirección ha sido guardada correctamente.', 'success');
            }

            clearAddressCache();
            await refetch();
            handleCloseModal();
            return true;
        } catch (err: any) {
            console.error('Error al guardar dirección:', err);
            const backendMessage = err.response?.data?.message;
            const displayMessage = Array.isArray(backendMessage)
                ? backendMessage.join('. ')
                : (backendMessage || 'No se pudo guardar la dirección');

            showNotification('Error', displayMessage, 'error');
            return false;
        }
    }, [refetch, addressToEdit, showNotification, handleCloseModal]);

    const handleDeleteAddress = (address: DataSaveAddress) => {
        setAddressToDelete(address);
    };

    const cancelDelete = () => {
        setAddressToDelete(null);
    };

    const confirmDeleteAddress = useCallback(async () => {
        if (!addressToDelete) return;
        try {
            await AddressServices.deleteAddressService(addressToDelete.uid || addressToDelete.id);
            showNotification('Dirección eliminada', 'La dirección ha sido eliminada con éxito', 'success');
            clearAddressCache();
            await refetch();
            setAddressToDelete(null);
        } catch (err) {
            console.error('Error al eliminar dirección:', err);
            showNotification('Error', 'No se pudo eliminar la dirección', 'error');
        }
    }, [refetch, addressToDelete, showNotification]);

    const toggleFavorite = useCallback(async (address: DataSaveAddress) => {
        const addressId = address.uid || address.id;
        const currentFavoriteState = address.isFavorite;

        setLocalAddresses(prev => {
            const updated = prev.map(addr => {
                const isTarget = (addr.uid || addr.id) === addressId;
                if (isTarget) {
                    return { ...addr, isFavorite: !currentFavoriteState };
                }
                if (!currentFavoriteState) {
                    return { ...addr, isFavorite: false };
                }
                return addr;
            });
            return updated;
        });

        try {
            await AddressServices.toggleFavoriteService(addressId);
            clearAddressCache();
        } catch (err) {
            console.error('Error al cambiar favorito:', err);
            setLocalAddresses(prev => prev.map(addr => {
                const isTarget = (addr.uid || addr.id) === addressId;
                if (isTarget) {
                    return { ...addr, isFavorite: currentFavoriteState };
                }
                return addr;
            }));
            showNotification('Error', 'No se pudo actualizar el favorito', 'error');
        }
    }, [showNotification]);

    return {
        addresses: localAddresses,
        filteredAddresses,
        searchTerm,
        setSearchTerm,
        selectedLabel,
        setSelectedLabel,
        handleSaveAddress,
        handleEditAddress,
        handleCloseModal,
        handleDeleteAddress,
        confirmDeleteAddress,
        cancelDelete,
        toggleFavorite,
        addressToEdit,
        addressToDelete,
        isLoading,
        error
    };
};
