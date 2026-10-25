import { useCallback, useState, useEffect } from 'react';
import { AddressFormData, AddressFormErrors } from '../types';
import { getFromStorage } from '../utils/storage.utils';
import AddressServices from '../services/AddressService';
import { DataSaveAddress, ZipCodeResponse } from '../types';


const inputForm: AddressFormData = {
    uid: '',
    addressLine: '',
    interiorNumber: '',
    colony: '',
    postalCode: '',
    city: '',
    state: '',
    country: 'México',
    references: '',
    fullName: '',
    phone: '',
    email: '',
    company: '',
    rfc: '',
    alias: '',
    showAliasField: false
};


export interface StepOneStoredData {
    remitterData: AddressFormData;
    addresseeData: AddressFormData;
}

export const useStepOne = () => {

    const getInitialStepOneData = (): StepOneStoredData => {
        const storedData = getFromStorage<StepOneStoredData>('stepOneData');

        if (storedData) {
            return storedData;
        }

        return {
            remitterData: inputForm,
            addresseeData: inputForm
        };
    };

    const initialData = getInitialStepOneData();

    const [remitterData, setRemitterData] = useState<AddressFormData>(initialData.remitterData);
    const [addresseeData, setAddresseeData] = useState<AddressFormData>(initialData.addresseeData);
    const [remitterErrors, setRemitterErrors] = useState<AddressFormErrors>({});
    const [addresseeErrors, setAddresseeErrors] = useState<AddressFormErrors>({});
    const [remitterColonies, setRemitterColonies] = useState<ZipCodeResponse[]>([]);
    const [addresseeColonies, setAddresseeColonies] = useState<ZipCodeResponse[]>([]);
    const [isLoadingRemitterZip, setIsLoadingRemitterZip] = useState(false);
    const [isLoadingAddresseeZip, setIsLoadingAddresseeZip] = useState(false);

    const validateFormStepOne = (data: AddressFormData): AddressFormErrors => {
        const errors: AddressFormErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!data.addressLine.trim()) errors.addressLine = 'La calle y número son requeridos.';
        if (!data.colony.trim()) errors.colony = 'La colonia es requerida.';
        if (!data.postalCode.trim()) errors.postalCode = 'El código postal es requerido.';
        if (!data.city.trim()) errors.city = 'La ciudad es requerida.';
        if (!data.state.trim()) errors.state = 'El estado es requerido.';
        if (!data.country.trim()) errors.country = 'El País es requerido.';
        if (!data.references.trim()) errors.references = 'La referencia es requerida.';
        if (!data.fullName.trim()) errors.fullName = 'El nombre completo es requerido.';
        if (!data.phone || data.phone.length < 10) errors.phone = 'El teléfono debe tener al menos 10 dígitos.';

        if (!data.email.trim()) {
            errors.email = 'El correo electrónico es requerido.';
        } else if (!emailRegex.test(data.email)) {
            errors.email = 'El formato del correo no es válido.';
        }

        if (data.showAliasField && (!data.alias || !data.alias.trim())) {
            errors.alias = 'El alias es requerido si la opción está activada.';
        }
        return errors;
    };

    const handleInputChange = (
        formType: 'remitter' | 'addressee',
        event: { target: { name: string; value: string | boolean } }
    ) => {
        const { name, value } = event.target;
        const key = name as keyof AddressFormData;
        const setter = formType === 'remitter' ? setRemitterData : setAddresseeData;
        if (name === 'postalCode') {
            const val = value as string;
            if (val.length !== 5) {
                if (formType === 'remitter') setRemitterColonies([]);
                else setAddresseeColonies([]);

                setter(prev => ({
                    ...prev,
                    postalCode: val,
                    colony: '',
                    state: '',
                    city: ''
                }));
                return;
            }
        }

        setter(prev => ({ ...prev, [key]: value }));
    };

    const clearForm = (formType: 'remitter' | 'addressee') => {
        if (formType === 'remitter') {
            setRemitterData(inputForm);
            setRemitterErrors({});
            setRemitterColonies([]);
        } else {
            setAddresseeData(inputForm);
            setAddresseeErrors({});
            setAddresseeColonies([]);
        }
    };

    const handleAddressSelect = useCallback((
        formType: 'remitter' | 'addressee',
        selectedAddress: DataSaveAddress
    ) => {
        const setter = formType === 'remitter' ? setRemitterData : setAddresseeData;
        const sanitizedAddress: AddressFormData = {
            uid: selectedAddress.uid || '',
            addressLine: selectedAddress.addressLine || '',
            interiorNumber: selectedAddress.interiorNumber || '',
            colony: selectedAddress.colony || '',
            postalCode: selectedAddress.postalCode || '',
            city: selectedAddress.city || '',
            state: selectedAddress.state || '',
            country: selectedAddress.country || 'México',
            references: selectedAddress.references || '',
            fullName: selectedAddress.fullName || '',
            phone: selectedAddress.phone || '',
            email: selectedAddress.email || '',
            company: selectedAddress.company || '',
            rfc: selectedAddress.rfc || '',
            alias: selectedAddress.alias || '',
            showAliasField: false
        };

        setter(sanitizedAddress);
    }, []);

    useEffect(() => {
        const fetchZip = async () => {
            if (remitterData.postalCode.length === 5) {
                setIsLoadingRemitterZip(true);
                try {
                    const data = await AddressServices.getZipCodeData(remitterData.postalCode);
                    setRemitterColonies(data || []);
                    if (data && data.length === 1) {
                        setRemitterData(prev => ({
                            ...prev,
                            colony: data[0].colony,
                            state: data[0].state,
                            city: data[0].city
                        }));
                    }
                } catch (e) {
                    setRemitterColonies([]);
                } finally {
                    setIsLoadingRemitterZip(false);
                }
            }
        };
        const tid = setTimeout(fetchZip, 100);
        return () => clearTimeout(tid);
    }, [remitterData.postalCode]);

    useEffect(() => {
        const fetchZip = async () => {
            if (addresseeData.postalCode.length === 5) {
                setIsLoadingAddresseeZip(true);
                try {
                    const data = await AddressServices.getZipCodeData(addresseeData.postalCode);
                    setAddresseeColonies(data || []);
                    if (data && data.length === 1) {
                        setAddresseeData(prev => ({
                            ...prev,
                            colony: data[0].colony,
                            state: data[0].state,
                            city: data[0].city
                        }));
                    }
                } catch (e) {
                    setAddresseeColonies([]);
                } finally {
                    setIsLoadingAddresseeZip(false);
                }
            }
        };
        const tid = setTimeout(fetchZip, 100);
        return () => clearTimeout(tid);
    }, [addresseeData.postalCode]);

    useEffect(() => {
        if (!remitterData.colony) return;
        const info = remitterColonies.find(c => c.colony === remitterData.colony);
        if (info) {
            setRemitterData(prev => ({ ...prev, state: info.state, city: info.city }));
        }
    }, [remitterData.colony, remitterColonies]);

    useEffect(() => {
        if (!addresseeData.colony) return;
        const info = addresseeColonies.find(c => c.colony === addresseeData.colony);
        if (info) {
            setAddresseeData(prev => ({ ...prev, state: info.state, city: info.city }));
        }
    }, [addresseeData.colony, addresseeColonies]);

    return {
        remitterData,
        addresseeData,
        remitterErrors,
        addresseeErrors,
        remitterColonies,
        addresseeColonies,
        isLoadingRemitterZip,
        isLoadingAddresseeZip,
        handleInputChange,
        validateFormStepOne,
        setRemitterErrors,
        setAddresseeErrors,
        clearForm,
        handleAddressSelect,
        setRemitterData,
        setAddresseeData
    };
};