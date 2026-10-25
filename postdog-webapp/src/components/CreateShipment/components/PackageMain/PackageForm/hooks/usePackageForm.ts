import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { useCreateShipmentContext } from '../../../../../../context/CreateShipmentContext';
import { CalculateShipmentWeights } from '../../../../../../utils';
import { PackageResponse } from '../../../../../../types';
import PackageService from '../../../../../../services/PackageService';

export const usePackageForm = (id: number, onPackageSelected?: () => void) => {
    const { state, updatePackage, addProductToPackage, duplicatePackage } = useCreateShipmentContext();
    const [savedPackages, setSavedPackages] = useState<PackageResponse[]>([]);
    const [isLoadingPackages, setIsLoadingPackages] = useState(true);

    const pkg = state.packages.find(p => p.id === id)!;
    const packageErrors = state.errors.packages[id] || {};

   const loadPackages = useCallback(async () => {
        setIsLoadingPackages(true);
        try {
            const data = await PackageService.getPackagesAll();
            setSavedPackages(data);
        } catch (error) {
            console.error("Error al cargar paquetes:", error);
        } finally {
            setIsLoadingPackages(false);
        }
    }, []);

    useEffect(() => {
        loadPackages();
    }, [loadPackages]);


    const packageOptions = useMemo(() => {
        return savedPackages.map(p => ({
            value: p.uid,
            label: `${p.alias} · ${p.lengthCm}×${p.widthCm}×${p.heightCm} cm · ${p.weightKg}kg`
        }));
    }, [savedPackages]);

    const handleSavedPackageChange = useCallback((e: { target: { name: string; value: string | number } }) => {
        const selectedUid = e.target.value.toString();
        
        const savedPkg = savedPackages.find(p => p.uid === selectedUid);

        if (savedPkg) {
            const fullProductType = savedPkg.productType || '';
            const [code, ...descParts] = fullProductType.split(' - ');

            updatePackage(id, {
                savedPackageId: selectedUid,
                length: savedPkg.lengthCm ? Math.round(Number(savedPkg.lengthCm)).toString() : '',
                width: savedPkg.widthCm ? Math.round(Number(savedPkg.widthCm)).toString() : '',
                height: savedPkg.heightCm ? Math.round(Number(savedPkg.heightCm)).toString() : '',
                weight: savedPkg.weightKg ? Math.round(Number(savedPkg.weightKg)).toString() : '',
                productTypeCode: code?.trim() || '',
                productTypeDescription: descParts.join(' - ')?.trim() || ''
            });
        } else {
            updatePackage(id, { savedPackageId: '' });
        }
    }, [id, updatePackage, savedPackages]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldsToResetPackage = ['length', 'width', 'height', 'weight'];
        
        const sanitizedValue = fieldsToResetPackage.includes(name) 
            ? value.replace(/[^0-9]/g, '') 
            : value;

        const updates: any = { [name]: sanitizedValue };
        if (fieldsToResetPackage.includes(name)) {
            updates.savedPackageId = '';
        }
        
        updatePackage(id, updates);
    };

    const { volumetricWeight, quotedWeight } = CalculateShipmentWeights({
        weight: pkg.weight,
        length: pkg.length,
        height: pkg.height,
        width: pkg.width
    });

    const handleProductTypeSelect = (opt: { code: string; description: string }) => {
        updatePackage(id, { 
            productTypeCode: opt.code, 
            productTypeDescription: opt.description,
            savedPackageId: ''
        });
    };

    const toggleSavePackage = () => {
        updatePackage(id, { savePackage: !pkg.savePackage });
    };

    const toggleShowProducts = () => {
        updatePackage(id, { showProducts: !pkg.showProducts });
    };

    const clearForm = () => {
        updatePackage(id, {
            length: '',
            width: '',
            height: '',
            weight: '',
            productTypeCode: '',
            productTypeDescription: '',
            savedPackageId: '',
            products: pkg.products.map(p => ({
                ...p,
                name: '',
                sku: '',
                price: '',
                quantity: ''
            }))
        });
    };

    const handleDuplicatePackage = () => {
        duplicatePackage(id);
    };

    const onSelectSavedPackage = (e: any) => {
        console.log(e);
        handleSavedPackageChange(e);
        // if (onPackageSelected) {
        //     onPackageSelected();
        // }
    };

    return {
        pkg,
        packageOptions,
        isLoadingPackages,
        handleInputChange,
        handleSavedPackageChange,
        volumetricWeight,
        quotedWeight,
        handleProductTypeSelect,
        toggleSavePackage,
        toggleShowProducts,
        addProductToPackage,
        clearForm, 
        duplicatePackage: handleDuplicatePackage,
        packageErrors,
        onSelectSavedPackage
    };
};
