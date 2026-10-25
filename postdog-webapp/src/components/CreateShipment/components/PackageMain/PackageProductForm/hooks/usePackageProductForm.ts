import { useMemo } from 'react';
import { useCreateShipmentContext } from '../../../../../../context/CreateShipmentContext';

export const usePackageProductForm = (packageId: number, productId: number) => {
    const { state, updateProduct, removeProductFromPackage } = useCreateShipmentContext();
    
    const product = useMemo(() => {
        const pkg = state.packages.find(p => p.id === packageId);
        return pkg?.products.find(p => p.id === productId);
    }, [state.packages, packageId, productId]);

    const handleChange = (field: string, value: string) => {
        updateProduct(packageId, productId, { [field]: value });
    };
    const handleClear = () => {
        updateProduct(packageId, productId, {
            name: '',
            sku: '',
            price: '',
            quantity: ''
        });
    };

    const handleRemove = () => {
        removeProductFromPackage(packageId, productId);
    };

    return {
        product,
        handleChange,
        handleClear,
        handleRemove
    };
};