import React, { useState, useMemo, useEffect } from 'react';
import { useCreateShipmentContext } from "../../../../../context/CreateShipmentContext";
import { useSavedAddresses } from "../../../../../hooks/useSavedAddresses";
import AddressServices from "../../../../../services/AddressService";
import { useNotification } from "../../../../../context/NotificationContext";
import styles from '../AddresseeForm.module.scss';
import { AddressData } from '../../../../../types';

export const useAddresseeForm = () => {
    const { state, updateAddressee, setErrors } = useCreateShipmentContext();
    const { addressee, errors } = state;

    const [selectedAddressId, setSelectedAddressId] = useState<string | number>(addressee.savedAddressId || '');
    
    useEffect(() => {
        setSelectedAddressId(addressee.savedAddressId || '');
    }, [addressee.savedAddressId]);
    const { addresses: savedAddresses, isLoading: isLoadingAddresses } = useSavedAddresses('destination');
    const { showNotification } = useNotification();
    const [colonyOptions, setColonyOptions] = useState<{ label: string; value: string }[]>([]);
    const [isLoadingZipCode, setIsLoadingZipCode] = useState(false);
    const addresseeErrors = errors.addressee;

    useEffect(() => {
        if (!isLoadingAddresses && savedAddresses.length > 0) {
            const match = savedAddresses.find(addr =>
                addr.postalCode === addressee.zipCode &&
                addr.addressLine === addressee.street &&
                addr.alias === addressee.alias
            );

            if (match) {
                const mid = (match.uid || match.id || '') as string;
                setSelectedAddressId(mid);
                if (addressee.savedAddressId !== mid) {
                    updateAddressee({ savedAddressId: mid });
                }
            }
        }
    }, [savedAddresses, isLoadingAddresses, addressee.zipCode, addressee.street, addressee.alias]);

    const addressOptions = useMemo(() => savedAddresses.map(address => ({
        label: (
            <div className={styles['saved-address-option']}>
                <span className={styles['saved-address-option__alias']}>
                    {address.alias}
                </span>
                <span className={styles['saved-address-option__badge']}>
                    {address.type === 'both' ? 'Ambos' : (address.type === 'origin' ? 'Origen' : 'Destino')}
                </span>
            </div>
        ),
        value: address.uid || address.id || ''
    })), [savedAddresses]);

    const fetchColoniesForZip = async (zip: string, targetColony?: string) => {
        setIsLoadingZipCode(true);
        try {
            const data = await AddressServices.getZipCodeData(zip);
            if (data && data.length > 0) {
                const firstMatch = data[0];
                const colonies = data.map(item => ({
                    label: item.colony,
                    value: item.colony
                }));
                colonies.push({ label: 'Otro', value: 'Otro' });
                setColonyOptions(colonies);

                if (!targetColony) {
                    updateAddressee({
                        state: firstMatch.state,
                        city: firstMatch.city,
                        zipCode: zip,
                        colony: '',
                        customColony: ''
                    });

                } else {
                    updateAddressee({ colony: targetColony, customColony: '' });
                }
            }
        } catch (error: any) {
            setColonyOptions([{ label: 'Otro', value: 'Otro' }]);
            if (!targetColony) {
                updateAddressee({ state: '', city: '', colony: '', customColony: '' });
            }
            if (error.response?.status === 404) {
                const message = error.response.data?.message || `No se encontró el código postal: ${zip}`;
                showNotification('Código postal no encontrado', message, 'error');
                setErrors({ addressee: { zipCode: 'No encontrado' } });
            }
        } finally {
            setIsLoadingZipCode(false);
        }
    };

    const handleSelectSavedAddress = (e: { target: { value: string | number } }) => {
        const selectedUid = e.target.value;
        const selectedAddress = savedAddresses.find(addr => (addr.uid === selectedUid || addr.id === selectedUid));

        setSelectedAddressId(selectedUid);

        if (selectedAddress) {
            updateAddressee({
                street: selectedAddress.addressLine || '',
                internalNumber: selectedAddress.interiorNumber || '',
                zipCode: selectedAddress.postalCode || '',
                colony: selectedAddress.colony || '',
                country: selectedAddress.country || 'MX',
                state: selectedAddress.state || '',
                city: selectedAddress.city || '',
                reference: selectedAddress.references || '',
                fullName: selectedAddress.fullName || '',
                phone: selectedAddress.phone || '',
                email: selectedAddress.email || '',
                company: selectedAddress.company || '',
                rfc: selectedAddress.rfc || '',
                alias: selectedAddress.alias || '',
                savedAddressId: (selectedAddress.uid || selectedAddress.id || '') as string,
                customColony: ''
            });

            if (selectedAddress.postalCode.length === 5) {
                fetchColoniesForZip(selectedAddress.postalCode, selectedAddress.colony);
            }
        }
    };


    const handleChange = (e: { target: { name: string, value: string | number } }) => {
        const { name, value } = e.target;
        const updates: Partial<AddressData> = { [name]: value };
        
        if (selectedAddressId !== '') {
            setSelectedAddressId('');
            updates.savedAddressId = undefined;
            updates.alias = '';
        }

        if (name === 'colony' && value !== 'Otro') {
            updates.customColony = '';
        }
        
        updateAddressee(updates);
    };

    const handleZipCodeChange = async (e: { target: { value: string } }) => {
        const value = e.target.value.replace(/\D/g, '');

        if (selectedAddressId !== '') {
            setSelectedAddressId('');
            updateAddressee({
                savedAddressId: undefined,
                alias: ''
            });
        }

        updateAddressee({ zipCode: value });

        if (value.length === 5) {
            fetchColoniesForZip(value);
        } else {
            setColonyOptions([{ label: 'Otro', value: 'Otro' }]);
            updateAddressee({ state: '', city: '', colony: '', customColony: '' });
        }
    };

    const handlePhoneChange = (e: { target: { value: string } }) => {
        const value = e.target.value.replace(/\D/g, '');
        const updates: Partial<AddressData> = { phone: value };

        if (selectedAddressId !== '') {
            setSelectedAddressId('');
            updates.savedAddressId = undefined;
            updates.alias = '';
        }

        updateAddressee(updates);
    };

    const toggleSaveAddress = () => {
        updateAddressee({ 
            saveAddress: !addressee.saveAddress,
            alias: '' 
        });
    };

    useEffect(() => {
        if (addressee.zipCode && addressee.zipCode.length === 5) {
            fetchColoniesForZip(addressee.zipCode, addressee.colony);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isCustomColony = useMemo(() => {
        if (addressee.colony === 'Otro') return true;
        if (!addressee.colony || colonyOptions.length === 0) return false;
        return !colonyOptions.some(opt => opt.value === addressee.colony);
    }, [addressee.colony, colonyOptions]);

    return {
        addressee,
        isLoadingAddresses,
        addressOptions,
        selectedAddressId,
        handleSelectSavedAddress,
        handleChange,
        handleZipCodeChange,
        handlePhoneChange,
        toggleSaveAddress,
        updateAddressee,
        colonyOptions,
        isLoadingZipCode,
        addresseeErrors,
        isCustomColony
    };
};