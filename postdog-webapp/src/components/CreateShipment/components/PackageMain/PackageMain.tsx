import React from 'react';
import { Plus } from 'lucide-react';
import styles from './PackageMain.module.scss';
import PackageForm from './PackageForm';
import ButtonUi from '../../../ui/Button/ButtonUi';
import { useCreateShipmentContext } from '../../../../context/CreateShipmentContext';

interface PackageMainProps {
    onPackageSelected?: () => void;
}

const PackageMain: React.FC<PackageMainProps> = ({ onPackageSelected }) => {
    const { state, addPackage, removePackage } = useCreateShipmentContext();
    const { packages } = state;

    return (
        <div className={styles['package-form']}>
            {packages.map((pkg, index) => (
                <PackageForm 
                    key={pkg.id} 
                    id={pkg.id}
                    index={index} 
                    showIndex={packages.length > 1}
                    onRemove={packages.length > 1 ? () => removePackage(pkg.id) : undefined}
                    onPackageSelected={onPackageSelected}
                />
            ))}

            <ButtonUi 
                onClick={addPackage}
                type="button"
                variant={'light'}
                className={styles['package-form__add-package-btn']}
            >
                <Plus size={16} />
                Añadir paquete
            </ButtonUi>
        </div>
    );
};

export default PackageMain;
