import { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import { PackageResponse, QuoteFormData } from '../../../../types';
import { useQuoteFormValidation } from '../../../../hooks/useQuoteFormValidation';
import { CalculateShipmentWeights } from '../../../../utils';

import { useCreateShipmentContext } from '../../../../context/CreateShipmentContext';
import PackageService from '../../../../services/PackageService';
import AddressServices from '../../../../services/AddressService';
import { DataSaveAddress } from '../../../../types';
import { AddressOption } from '../../../ui/AddressSelectUi/types/addressSelectUis.type';

interface UseQuoteFormLogicProps {
    initialData?: Partial<QuoteFormData>;
}

export const useQuoteFormComponent = ({ initialData }: UseQuoteFormLogicProps) => {
    const sanitizedInitialData = useMemo(() => {
        if (!initialData) return initialData;
        return {
            ...initialData,
            length: initialData.length ? Math.round(Number(initialData.length)).toString() : initialData.length,
            width: initialData.width ? Math.round(Number(initialData.width)).toString() : initialData.width,
            height: initialData.height ? Math.round(Number(initialData.height)).toString() : initialData.height,
            weight: initialData.weight ? Math.round(Number(initialData.weight)).toString() : initialData.weight,
        };
    }, [initialData]);

    const { formData, errors, handleChange, updateField, validate, resetForm } = useQuoteFormValidation(sanitizedInitialData as any);
    const { 
        state, 
        openModalCreateShipment, 
        updateRemitter, 
        updateAddressee, 
        updatePackage, 
        isModalCreateShipmentOpen,
        setIsRemitterEditing,
        setIsAddresseeEditing
    } = useCreateShipmentContext();

    const [savedPackages, setSavedPackages] = useState<PackageResponse[]>([]);
    const [isLoadingPackages, setIsLoadingPackages] = useState(true);

    const [originAddresses, setOriginAddresses] = useState<AddressOption[]>([]);
    const [destinationAddresses, setDestinationAddresses] = useState<AddressOption[]>([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

    const loadPackages = useCallback(async () => {
        setIsLoadingPackages(true);
        try {
            const data = await PackageService.getPackagesAll();
            setSavedPackages(data);
        } catch (error) {
            console.error("Error al cargar paquetes guardados:", error);
        } finally {
            setIsLoadingPackages(false);
        }
    }, []);

    const loadAddresses = useCallback(async () => {
        setIsLoadingAddresses(true);
        try {
            const [originData, destinationData, bothData] = await Promise.all([
                AddressServices.getSavedAddressesAllServices('origin'),
                AddressServices.getSavedAddressesAllServices('destination'),
                AddressServices.getSavedAddressesAllServices('both')
            ]);
            
            const mapToOption = (addr: DataSaveAddress): AddressOption => ({
                ...addr,
                id: addr.uid || addr.id,
                tag: addr.type === 'origin' ? 'Origen' : (addr.type === 'destination' ? 'Destino' : 'Ambas')
            });

            const mergeAndUnique = (specific: DataSaveAddress[], both: DataSaveAddress[]) => {
                const combined = [...specific, ...both];
                const uniqueMap = new Map();
                combined.forEach(addr => {
                    const key = addr.uid || addr.id;
                    if (!uniqueMap.has(key)) {
                        uniqueMap.set(key, addr);
                    }
                });
                return Array.from(uniqueMap.values());
            };

            setOriginAddresses(mergeAndUnique(originData, bothData).map(mapToOption));
            setDestinationAddresses(mergeAndUnique(destinationData, bothData).map(mapToOption));
        } catch (error) {
            console.error("Error al cargar direcciones guardadas:", error);
        } finally {
            setIsLoadingAddresses(false);
        }
    }, []);

    const handleOriginSelect = useCallback((addr: AddressOption) => {
        updateField('originPostalCode', addr.postalCode);

        updateRemitter({
            street: addr.addressLine,
            internalNumber: addr.interiorNumber || '',
            zipCode: addr.postalCode,
            colony: addr.colony,
            country: addr.country || 'MX',
            state: addr.state || '',
            city: addr.city || '',
            reference: addr.references || '',
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            email: addr.email || '',
            company: addr.company || '',
            rfc: addr.rfc || '',
            alias: addr.alias || '',
            savedAddressId: addr.id
        });

        if (addr.id.startsWith('zip-')) {
            setIsRemitterEditing(true);
            setIsAddresseeEditing(true);
        }
    }, [updateField, updateRemitter, setIsRemitterEditing, setIsAddresseeEditing]);

    const handleDestinationSelect = useCallback((addr: AddressOption) => {
        updateField('destinationPostalCode', addr.postalCode);

        updateAddressee({
            street: addr.addressLine,
            internalNumber: addr.interiorNumber || '',
            zipCode: addr.postalCode,
            colony: addr.colony,
            country: addr.country || 'MX',
            state: addr.state || '',
            city: addr.city || '',
            reference: addr.references || '',
            fullName: addr.fullName || '',
            phone: addr.phone || '',
            email: addr.email || '',
            company: addr.company || '',
            rfc: addr.rfc || '',
            alias: addr.alias || '',
            savedAddressId: addr.id
        });

        if (addr.id.startsWith('zip-')) {
            setIsRemitterEditing(true);
            setIsAddresseeEditing(true);
        }
    }, [updateField, updateAddressee, setIsAddresseeEditing, setIsRemitterEditing]);

    const loadFavorites = useCallback(async () => {
        try {
            const [favAddrRes, favPkgRes] = await Promise.allSettled([
                AddressServices.getFavoriteAddressService(),
                PackageService.getFavoritePackage()
            ]);

            if (favAddrRes.status === 'fulfilled' && favAddrRes.value) {
                const addr = favAddrRes.value;
                handleOriginSelect({
                    ...addr,
                    id: addr.uid || addr.id,
                    tag: addr.type === 'origin' ? 'Origen' : (addr.type === 'destination' ? 'Destino' : 'Ambas')
                });
            }

            if (favPkgRes.status === 'fulfilled' && favPkgRes.value) {
                const pkg = favPkgRes.value;
                updateField('savedPackageId', pkg.uid);
                updateField('length', Math.round(Number(pkg.lengthCm)).toString());
                updateField('width', Math.round(Number(pkg.widthCm)).toString());
                updateField('height', Math.round(Number(pkg.heightCm)).toString());
                updateField('weight', Math.round(Number(pkg.weightKg)).toString());

                const fullProductType = pkg.productType || '';
                const [code, ...descParts] = fullProductType.split(' - ');

                updateField('productTypeCode', code?.trim() || '');
                updateField('productTypeDescription', descParts.join(' - ')?.trim() || '');
            }
        } catch (error) {
            console.error("Error al cargar favoritos:", error);
        }
    }, [handleOriginSelect, updateField]);

    useEffect(() => {
        loadPackages();
        loadAddresses();
        loadFavorites();
    }, [loadPackages, loadAddresses, loadFavorites]);

    const wasOpenRef = useRef(false);

    useEffect(() => {
        if (wasOpenRef.current && !isModalCreateShipmentOpen) {
            resetForm();
        }
        wasOpenRef.current = isModalCreateShipmentOpen;
    }, [isModalCreateShipmentOpen, resetForm]);

    useEffect(() => {
        const zip = formData.originPostalCode;
        if (zip !== undefined && zip !== state.remitter.zipCode) {
            updateRemitter({ 
                zipCode: zip,
                street: '',
                internalNumber: '',
                colony: '',
                city: '',
                state: '',
                reference: '',
                fullName: '',
                phone: '',
                email: '',
                company: '',
                rfc: '',
                alias: '',
                savedAddressId: undefined
            });
        }
    }, [formData.originPostalCode]); 

    useEffect(() => {
        const zip = formData.destinationPostalCode;
        if (zip !== undefined && zip !== state.addressee.zipCode) {
            updateAddressee({ 
                zipCode: zip,
                street: '',
                internalNumber: '',
                colony: '',
                city: '',
                state: '',
                reference: '',
                fullName: '',
                phone: '',
                email: '',
                company: '',
                rfc: '',
                alias: '',
                savedAddressId: undefined
            });
        }
    }, [formData.destinationPostalCode]);

    const isFormComplete = useMemo(() => {
        const origin = formData.originPostalCode || '';
        const destination = formData.destinationPostalCode || '';
        const productType = formData.productTypeCode || '';

        const length = Number(formData.length || 0);
        const width = Number(formData.width || 0);
        const height = Number(formData.height || 0);
        const weight = Number(formData.weight || 0);

        const isOriginValid = origin.length === 5;
        const isDestinationValid = destination.length === 5;

        return (
            isOriginValid &&
            isDestinationValid &&
            productType.trim() !== '' &&
            length > 0 &&
            width > 0 &&
            height > 0 &&
            weight > 0
        );
    }, [formData, state.remitter, state.addressee]);

    const packageOptions = useMemo(() => {
        return savedPackages.map(pkg => ({
            value: pkg.uid,
            label: `${pkg.alias} · ${pkg.lengthCm}×${pkg.widthCm}×${pkg.heightCm} cm · ${pkg.weightKg}kg`
        }));
    }, [savedPackages]);



    const handleSavedPackageChange = useCallback((e: { target: { name: string; value: string | number } }) => {
        const selectedUid = e.target.value.toString();
        updateField('savedPackageId', selectedUid);

        const pkg = savedPackages.find(p => p.uid === selectedUid);

        if (pkg) {
            updateField('length', Math.round(Number(pkg.lengthCm)).toString());
            updateField('width', Math.round(Number(pkg.widthCm)).toString());
            updateField('height', Math.round(Number(pkg.heightCm)).toString());
            updateField('weight', Math.round(Number(pkg.weightKg)).toString());

            const fullProductType = pkg.productType || '';
            const [code, ...descParts] = fullProductType.split(' - ');

            updateField('productTypeCode', code?.trim() || '');
            updateField('productTypeDescription', descParts.join(' - ')?.trim() || '');

            if (state.packages.length > 0) {
                updatePackage(state.packages[0].id, {
                    length: Math.round(Number(pkg.lengthCm)).toString(),
                    width: Math.round(Number(pkg.widthCm)).toString(),
                    height: Math.round(Number(pkg.heightCm)).toString(),
                    weight: Math.round(Number(pkg.weightKg)).toString(),
                    productTypeCode: code?.trim() || '',
                    productTypeDescription: descParts.join(' - ')?.trim() || '',
                    savedPackageId: selectedUid,
                    alias: pkg.alias
                });
            }
        }
    }, [updateField, savedPackages, state.packages, updatePackage]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            openModalCreateShipment();
        }
    };

    const { massWeight, volumetricWeight, quotedWeight } = CalculateShipmentWeights({
        weight: formData.weight,
        length: formData.length,
        height: formData.height,
        width: formData.width
    });

    return {
        formData,
        errors,
        handleChange,
        updateField,
        handleFormSubmit,
        resetForm,
        massWeight,
        volumetricWeight,
        quotedWeight,
        packageOptions,
        handleSavedPackageChange,
        handleOriginSelect,
        handleDestinationSelect,
        isLoadingPackages,
        isLoadingAddresses,
        originAddresses,
        destinationAddresses,
        isFormComplete,
        state,
        updatePackage,
        setIsRemitterEditing,
        setIsAddresseeEditing
    };
};