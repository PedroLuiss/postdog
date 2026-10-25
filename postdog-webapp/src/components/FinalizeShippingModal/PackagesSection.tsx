import React, { useState } from 'react';
import styles from './FinalizeShippingModal.module.scss';
import { Package, PackageFormErrors, PackageItem } from '../../types';
import { PackageForm } from '../ShippingQuote/Steps/Two/Form/PackageForm';
import { EditIcon } from '../icons';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface Props {
    packages: Package[];
    editingPackageId: string | null;
    packageErrors: PackageFormErrors[];
    handlers: {
        onEdit: (pkg: Package) => void;
        onCancel: () => void;
        onSave: () => void;
        onUpdatePackage: (packageId: string, field: keyof Package, value: any) => void;
        onAddProduct: (packageId: string) => void;
        onDeleteProduct: (packageId: string, productId: string) => void;
        onUpdateProduct: (packageId: string, productId: string, field: keyof PackageItem, value: any) => void;
        onDeletePackage: (packageId: string) => void;
        onClearPackage: (packageId: string) => void;
        onDuplicateProduct: (packageId: string, productId: string) => void;
        onClearProduct: (packageId: string, productId: string) => void;
    }
}

export const PackagesSection: React.FC<Props> = ({ packages, editingPackageId, packageErrors, handlers }) => {
    const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});
    const togglePackageProducts = (packageId: string) => {
        setExpandedPackages(prev => ({ ...prev, [packageId]: !prev[packageId] }));
    };

    return (
        <>
            {packages.map((pkg, index) => {
                const isCurrentlyEditing = editingPackageId === pkg.id;
                const packageErrorsForForm = packageErrors.find(e => e.id === pkg.id);
                return (
                    <section key={pkg.id} className={styles['package-summary']}>
                        {isCurrentlyEditing ? (
                            <div className={styles['package-summary__form-container']}>
                                <PackageForm
                                    packageData={pkg}
                                    packageIndex={index}
                                    errors={packageErrorsForForm}
                                    onDelete={handlers.onDeletePackage}
                                    onUpdatePackage={handlers.onUpdatePackage}
                                    onAddProduct={handlers.onAddProduct}
                                    onDeleteProduct={handlers.onDeleteProduct}
                                    onUpdateProduct={handlers.onUpdateProduct}
                                    onClear={handlers.onClearPackage}
                                    onDuplicateProduct={handlers.onDuplicateProduct}
                                    onClearProduct={handlers.onClearProduct}
                                    action='edit'
                                />
                                <div className={styles['address-info__form-actions']}>
                                    <button onClick={handlers.onCancel} className={`${styles['address-info__form-actions--cancel']}`}>
                                        Cancelar
                                    </button>
                                    <button onClick={handlers.onSave} className={`${styles['finalize-shipping__button']} ${styles['finalize-shipping__button--primary']}`}>
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={styles['package-summary__main']}>
                                    <div>
                                        <div className={styles['package-summary__header']}>
                                            <ViewInArIcon />
                                            <h3 className={styles['package-summary__title']}>Paquete {index + 1}</h3>
                                        </div>
                                        <div className={styles['package-summary__info-group']}>
                                            <p>{pkg.packageType}</p>
                                            <p>{`${pkg.heightCm} x ${pkg.widthCm} x ${pkg.lengthCm} cm`}</p>
                                            <p>{`${pkg.weightKg} kg`}</p>
                                        </div>
                                        <p className={styles['package-summary__product-type']}>Tipo de producto: {pkg.productType}</p>
                                    </div>
                                    <button onClick={() => handlers.onEdit(pkg)} className={styles['package-summary__edit-button']}>
                                        <EditIcon /> Editar
                                    </button>
                                </div>
                                <div className={styles['package-summary__dropdown']} onClick={() => togglePackageProducts(pkg.id?? "")}>
                                    <div className='d-flex'>
                                        <span className={styles['package-summary__dropdown-title']}>Productos</span>
                                        <div className={styles['package-summary__badge']}>
                                            {pkg.items.length} producto(s)
                                        </div>
                                    </div>
                                    {expandedPackages[pkg.id??""] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </div>
                                {expandedPackages[pkg.id ?? ""] && (
                                     <div className={styles['product-list']}>
                                        {pkg.items.length > 0 ? (
                                            pkg.items.map(product => (
                                                <div key={product.id} className={styles['product-list__item']}>
                                                    <div className={styles['product-list__row']}>
                                                        <span className={styles['product-list__label']}>Nombre:</span>
                                                        <span className={styles['product-list__value']}>{product.name}</span>
                                                    </div>
                                                    <div className={styles['product-list__row']}>
                                                        <span className={styles['product-list__label']}>SKU:</span>
                                                        <span className={styles['product-list__value']}>{product.sku}</span>
                                                    </div>
                                                    <div className={styles['product-list__row']}>
                                                        <span className={styles['product-list__label']}>Cantidad:</span>
                                                        <span className={styles['product-list__value']}>{product.quantity}</span>
                                                    </div>
                                                    <div className={styles['product-list__row']}>
                                                        <span className={styles['product-list__label']}>Precio:</span>
                                                        <span className={styles['product-list__value']}>${Number(product.unitPrice).toFixed(2)} MXN</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className={styles['product-list__empty']}>Este paquete no tiene productos.</p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                )
            })}
        </>
    );
};