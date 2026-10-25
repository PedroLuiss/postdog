import { useState, useMemo, useEffect } from 'react';
import { useCreateShipmentContext } from "../../../../../context/CreateShipmentContext";
import { useSavedAddresses } from "../../../../../hooks/useSavedAddresses";
import AddressServices from "../../../../../services/AddressService";
import { useNotification } from "../../../../../context/NotificationContext";
import styles from '../RemitterForm.module.scss';
import { AddressData } from '../../../../../types';

export const useRemitterForm = () => {
    const { state, updateRemitter, setErrors } = useCreateShipmentContext();
    const { remitter, errors } = state;

    const [selectedAddressId, setSelectedAddressId] = useState<string | number>(remitter.savedAddressId || '');
    
    useEffect(() => {
        setSelectedAddressId(remitter.savedAddressId || '');
    }, [remitter.savedAddressId]);
    
    const { addresses: savedAddresses, isLoading: isLoadingAddresses } = useSavedAddresses('origin');
    const { showNotification } = useNotification();
    const [colonyOptions, setColonyOptions] = useState<{ label: string; value: string }[]>([]);
    const [isLoadingZipCode, setIsLoadingZipCode] = useState(false);
    const remitterErrors = errors.remitter;

    useEffect(() => {
        if (!isLoadingAddresses && savedAddresses.length > 0) {
            const match = savedAddresses.find(addr =>
                addr.postalCode === remitter.zipCode &&
                addr.addressLine === remitter.street &&
                addr.alias === remitter.alias
            );

            if (match) {
                const mid = (match.uid || match.id || '') as string;
                setSelectedAddressId(mid);
                if (remitter.savedAddressId !== mid) {
                    updateRemitter({ savedAddressId: mid });
                }
            }
        }
    }, [savedAddresses, isLoadingAddresses, remitter.zipCode, remitter.street, remitter.alias, remitter.savedAddressId, updateRemitter]);


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
                    updateRemitter({
                        state: firstMatch.state,
                        city: firstMatch.city,
                        zipCode: zip,
                        colony: '',
                        customColony: ''
                    });
                } else {
                    updateRemitter({ colony: targetColony, customColony: '' });
                }
            }
        } catch (error: any) {
            console.error('Error fetching zip code data:', error);
            setColonyOptions([{ label: 'Otro', value: 'Otro' }]);
            if (!targetColony) {
                updateRemitter({ state: '', city: '', colony: '', customColony: '' });
            }
            if (error.response?.status === 404) {
                const message = error.response.data?.message || `No se encontró el código postal: ${zip}`;
                showNotification('Código postal no encontrado', message, 'error');
                setErrors({ remitter: { zipCode: 'No encontrado' } });
            }
        } finally {
            setIsLoadingZipCode(false);
        }
    };

    const handleSelectSavedAddress = (e: { target: { name: string; value: string | number } }) => {
        const selectedUid = e.target.value;
        const selectedAddress = savedAddresses.find(addr => (addr.uid === selectedUid || addr.id === selectedUid));

        setSelectedAddressId(selectedUid);

        if (selectedAddress) {
            updateRemitter({
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


    const handleChangeValue = (e: { target: { name: string; value: string | number } }) => {
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
        
        updateRemitter(updates);
    };

    const handleZipCodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');

        if (selectedAddressId !== '') {
            setSelectedAddressId('');
            updateRemitter({
                savedAddressId: undefined,
                alias: ''
            });
        }

        updateRemitter({ zipCode: value });

        if (value.length === 5) {
            fetchColoniesForZip(value);
        } else {
            setColonyOptions([{ label: 'Otro', value: 'Otro' }]);
            updateRemitter({ state: '', city: '', colony: '', customColony: '' });
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        const updates: Partial<AddressData> = { phone: value };
        
        if (selectedAddressId !== '') {
            setSelectedAddressId('');
            updates.savedAddressId = undefined;
            updates.alias = '';
        }
        
        updateRemitter(updates);
    };

    const toggleSaveAddress = () => {
        updateRemitter({ 
            saveAddress: !remitter.saveAddress,
            alias: '' 
        });
    };

    useEffect(() => {
        if (remitter.zipCode && remitter.zipCode.length === 5) {
            fetchColoniesForZip(remitter.zipCode, remitter.colony);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isCustomColony = useMemo(() => {
        if (remitter.colony === 'Otro') return true;
        if (!remitter.colony || colonyOptions.length === 0) return false;
        return !colonyOptions.some(opt => opt.value === remitter.colony);
    }, [remitter.colony, colonyOptions]);

    return {
        remitter,
        addressOptions,
        selectedAddressId,
        isLoadingAddresses,
        handleSelectSavedAddress,
        handleChangeValue,
        handleZipCodeChange,
        handlePhoneChange,
        toggleSaveAddress,
        updateRemitter,
        colonyOptions,
        isLoadingZipCode,
        remitterErrors,
        isCustomColony
    };
};