
import { useState } from 'react';
import { generateUniqueId } from '../utils/id-generator';
import { Package, PackageFormErrors, PackageItem, ProductFormErrors } from '../types';
import { getFromStorage } from '../utils/storage.utils';

const createNewProduct = (): PackageItem => ({
    id: generateUniqueId(),
    name: '',
    sku: '',
    unitPrice: 0,
    quantity: 0,
});

const createNewPackage = (): Package => ({
    id: generateUniqueId(),
    packageType: '',
    lengthCm: 0,
    widthCm: 0,
    heightCm: 0,
    weightKg: 0,
    productType: '',
    alias: '',
    saveToList: false,
    items: [createNewProduct()],
});


export const useStepTwo = () => {

    const getInitialPackagesFromLocalStorage = (): Package[] => {
        const storedPackages = getFromStorage<Package[]>('stepTwoData');
        if (storedPackages && Array.isArray(storedPackages)) {
            return storedPackages.map(pkg => ({
                ...pkg,
                id: generateUniqueId(),
                items: pkg.items.map(prod => ({
                    ...prod,
                    id: generateUniqueId(),
                }))
            }));
        }

        return [createNewPackage()];
    };


    const [packages, setPackages] = useState<Package[]>(getInitialPackagesFromLocalStorage());
    const [errors, setErrors] = useState<PackageFormErrors[]>([]);

    const validateProduct = (product: PackageItem): ProductFormErrors => {
        const productErrors: ProductFormErrors = {};
        if (!product.name.trim()) productErrors.name = 'El nombre es requerido.';
        if (!product.unitPrice || Number(product.unitPrice) <= 0) productErrors.unitPrice = 'El precio debe ser mayor a 0.';
        if (!product.quantity || Number(product.quantity) <= 0) productErrors.quantity = 'La cantidad debe ser mayor a 0.';
        if (!product.sku.trim()) productErrors.sku = 'SKU es requerido.';
        return productErrors;
    };

    const validatePackage = (pkg: Package): PackageFormErrors => {
        const packageErrors: PackageFormErrors = { id: pkg.id ?? "", items: [] };

        if (!pkg.packageType.trim()) packageErrors.packageType = 'El tipo de embalaje es requerido.';
        if (!pkg.lengthCm || Number(pkg.lengthCm) <= 0) packageErrors.lengthCm = 'Largo debe ser mayor a 0.';
        if (!pkg.widthCm || Number(pkg.widthCm) <= 0) packageErrors.widthCm = 'Ancho debe ser mayor a 0.';
        if (!pkg.heightCm || Number(pkg.heightCm) <= 0) packageErrors.heightCm = 'Alto debe ser mayor a 0.';
        if (!pkg.weightKg || Number(pkg.weightKg) <= 0) packageErrors.weightKg = 'Peso debe ser mayor a 0.';
        if (!pkg.productType.trim()) packageErrors.productType = 'El tipo de producto es requerido.';

        if (pkg.saveToList && !pkg?.alias?.trim()) {
            packageErrors.alias = 'El alias es requerido si se guarda en la lista.';
        }

        pkg.items.forEach(product => {
            const productErrors = validateProduct(product);
            if (Object.keys(productErrors).length > 0) {
                packageErrors.items.push({ id: product.id ?? "", ...productErrors });
            }
        });

        return packageErrors;
    };

    const validateStep = (): boolean => {
        const allErrors: PackageFormErrors[] = packages.map(pkg => validatePackage(pkg));
        setErrors(allErrors);

        const isStepValid = allErrors.every(pError =>
            Object.keys(pError).length === 2 &&
            pError.items.length === 0
        );

        return isStepValid;
    };


    const handleAddPackage = () => {
        setPackages(prevPackages => [...prevPackages, createNewPackage()]);
    };

    const handleDeletePackage = (packageId: string) => {
        setPackages(prevPackages => {
            const updatedPackages = prevPackages.filter(p => p.id !== packageId);
            return updatedPackages.length > 0 ? updatedPackages : [];
        });
    };

    const handleUpdatePackage = (packageId: string, field: keyof Package, value: any) => {
        setPackages(prevPackages =>
            prevPackages.map(p =>
                p.id === packageId ? { ...p, [field]: value } : p
            )
        );
    };


    const handleDuplicatePackage = (packageId: string) => {
        const packageToDuplicate = packages.find(p => p.id === packageId);
        if (!packageToDuplicate) return;

        const newPackage: Package = {
            ...packageToDuplicate,
            id: generateUniqueId(),
            items: packageToDuplicate.items.map(prod => ({
                ...prod,
                id: generateUniqueId(),
            })),
        };

        const originalIndex = packages.findIndex(p => p.id === packageId);
        const newPackages = [...packages];
        newPackages.splice(originalIndex + 1, 0, newPackage);
        setPackages(newPackages);
    };

    const handleClearPackage = (packageId: string) => {
        setPackages(prevPackages =>
            prevPackages.map(p => {
                if (p.id !== packageId) {
                    return p;
                }
                return { ...createNewPackage(), id: p.id };
            })
        );
    };


    const handleAddProduct = (packageId: string) => {
        setPackages(prevPackages =>
            prevPackages.map(p =>
                p.id === packageId
                    ? { ...p, items: [...p.items, createNewProduct()] }
                    : p
            )
        );
    };

    const handleDeleteProduct = (packageId: string, productId: string) => {
        setPackages(prevPackages =>
            prevPackages.map(p => {
                if (p.id !== packageId) return p;
                const updatedProducts = p.items.filter(prod => prod.id !== productId);
                return { ...p, items: updatedProducts.length > 0 ? updatedProducts : [] };
            })
        );
    };

    const handleUpdateProduct = (packageId: string, productId: string, field: keyof PackageItem, value: any) => {
        setPackages(prevPackages =>
            prevPackages.map(p => {
                if (p.id !== packageId) return p;

                const updatedProductos = p.items.map(prod =>
                    prod.id === productId ? { ...prod, [field]: value } : prod
                );
                return { ...p, items: updatedProductos };
            })
        );
    };


    const handleDuplicateProduct = (packageId: string, productId: string) => {
        
        setPackages(prevPackages =>
            prevPackages.map(p => {
                if (p.id !== packageId) return p;
                
                const productToDuplicate = p.items.find(prod => prod.id === productId);
                console.log( 'Duplicando producto', productToDuplicate );
                if (!productToDuplicate) return p;

                const newProduct: PackageItem = {
                    ...productToDuplicate,
                    id: generateUniqueId(),
                };

                const originalIndex = p.items.findIndex(prod => prod.id === productId);
                const newProductos = [...p.items];
                newProductos.splice(originalIndex + 1, 0, newProduct);

                return { ...p, items: newProductos };
            })
        );
    };

    const handleClearProduct = (packageId: string, productId: string) => {
        setPackages(prevPackages =>
            prevPackages.map(p => {
                if (p.id !== packageId) return p;

                const updatedProductos = p.items.map(prod => {
                    if (prod.id !== productId) return prod;
                    return { ...createNewProduct(), id: prod.id };
                });

                return { ...p, items: updatedProductos };
            })
        );
    };

    return {
        packages,
        setPackages,
        errors,
        validateStep,
        handleAddPackage,
        handleDeletePackage,
        handleUpdatePackage,
        handleAddProduct,
        handleDeleteProduct,
        handleUpdateProduct,
        handleDuplicatePackage,
        handleClearPackage,
        handleDuplicateProduct,
        handleClearProduct,
    };
};