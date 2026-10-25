import { PackageForm } from './Form/PackageForm';
import styles from './StepTwo.module.scss';
import { Package, PackageFormErrors, PackageItem } from '../../../../types';
import { PlusIcon } from '../../../icons';

interface StepTwoProps {
    packages: Package[];
    errors: PackageFormErrors[];
    handleAddPackage: () => void;
    handleDeletePackage: (packageId: string) => void;
    handleUpdatePackage: (packageId: string, field: keyof Package, value: any) => void;
    handleAddProduct: (packageId: string) => void;
    handleDeleteProduct: (packageId: string, productId: string) => void;
    handleUpdateProduct: (packageId: string, productId: string, field: keyof PackageItem, value: any) => void;
    handleDuplicatePackage: (packageId: string) => void;
    handleClearPackage: (packageId: string) => void;
    handleDuplicateProduct: (packageId: string, productId: string) => void;
    handleClearProduct: (packageId: string, productId: string) => void;
}

export const StepTwo: React.FC<StepTwoProps> = ({
    packages,
    errors,
    handleAddPackage,
    handleDeletePackage,
    handleUpdatePackage,
    handleAddProduct,
    handleDeleteProduct,
    handleUpdateProduct,
    handleDuplicatePackage,
    handleClearPackage,
    handleDuplicateProduct,
    handleClearProduct
}) => {

    return (
        <div className={styles['step-two']}>
            {packages.map((pkg, index) => {
                const packageErrors = errors.find(e => e.id === pkg.id);
                return (
                    <PackageForm
                        errors={packageErrors}
                        key={pkg.id}
                        packageData={pkg}
                        packageIndex={index}
                        onDelete={handleDeletePackage}
                        onUpdatePackage={handleUpdatePackage}
                        onAddProduct={handleAddProduct}
                        onDeleteProduct={handleDeleteProduct}
                        onUpdateProduct={handleUpdateProduct}
                        onDuplicate={handleDuplicatePackage}
                        onClear={handleClearPackage}
                        onDuplicateProduct={handleDuplicateProduct}
                        onClearProduct={handleClearProduct}
                    />
                )
            })}
            <div className={styles['step-two__add-package-btn']}>
                <button onClick={handleAddPackage} className={`${styles['btn']} `}>
                    <PlusIcon className='me-1'/> <span>Añadir paquete</span>
                </button>
            </div>
        </div>
    );
};