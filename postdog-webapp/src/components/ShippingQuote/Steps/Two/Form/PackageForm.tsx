import React, { useEffect, useRef, useState } from 'react';
import styles from './style/PackageForm.module.scss';
import { ProductForm } from './ProductForm';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import { MenuIcon, PlusIcon } from '../../../../icons';
import { CustomTooltip } from '../../../../Quote/Tooltips/CustomTooltip';
import { CustomTooltipUi } from '../../../../ui/CustomTooltipUi';
import { Package, PackageFormErrors, PackageItem } from '../../../../../types';
import { useProductTypes } from '../../../../../hooks/useProductTypes';
import { usePackageTypes } from '../../../../../hooks/usePackageTypes';

interface PackageFormProps {
    packageData: Package;
    packageIndex: number;
    onDelete: (id: string) => void;
    onUpdatePackage: (id: string, field: keyof Package, value: any) => void;
    onDuplicate?: (id: string) => void;
    onClear: (id: string) => void;
    onAddProduct: (packageId: string) => void;
    onDeleteProduct: (packageId: string, productId: string) => void;
    onUpdateProduct: (packageId: string, productId: string, field: keyof PackageItem, value: any) => void;
    onDuplicateProduct: (packageId: string, productId: string) => void;
    onClearProduct: (packageId: string, productId: string) => void;
    errors?: PackageFormErrors;
    action?: 'add' | 'edit';
}

export const PackageForm: React.FC<PackageFormProps> = ({
    packageData,
    packageIndex,
    onDelete,
    onUpdatePackage,
    onAddProduct,
    onDeleteProduct,
    onUpdateProduct,
    onDuplicate,
    onClear,
    onDuplicateProduct,
    onClearProduct,
    errors,
    action = 'add'
}) => {
    const [isProductsVisible, setProductsVisible] = useState(true);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const { filteredTypes, filterTypes } = useProductTypes();

    const { packageTypes, isLoading: isLoadingPackageTypes, error: packageTypesError } = usePackageTypes();


    const handlePackageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const { name, value, type } = e.target;
        console.log(name);
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            onUpdatePackage(packageData.id ?? "", name as keyof Package, checked);
        } else {
            onUpdatePackage(packageData.id ?? "", name as keyof Package, value);
        }
    };

    const handleProductTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        onUpdatePackage(packageData.id ?? "", 'productType', query);
        filterTypes(query);
        setDropdownVisible(!!query);
    };

    const handleSelectProductType = (productName: string) => {
        onUpdatePackage(packageData.id ?? "", 'productType', productName);
        setDropdownVisible(false);
        filterTypes('');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getInputClassName = (fieldName: keyof PackageFormErrors) => {
        return `${styles['form-group__input']} ${errors?.[fieldName] ? styles['input--error'] : ''}`;
    };


    return (
        <>
            <div className={styles['package'] + " mb-3"}>
                <div className={styles['package__header']}>
                    <div className={styles['package__title']}>
                        <ViewInArIcon className={styles['package__icon']} />
                        <h3 className={styles['package__heading']}>
                            Paquete
                            <span className={styles['package__number-badge']}>
                                <p className='mb-0'>{packageIndex + 1}</p>
                            </span>
                        </h3>
                    </div>
                    <div className={styles['package__actions']}>
                        {
                            action == 'add' && (<> <CustomTooltipUi title="Eliminar paquete">
                                <button type="button" onClick={() => onDelete(packageData.id ?? "")} className={styles['package__actions__icon-btn']}>
                                    <DeleteOutlineIcon />
                                </button>
                            </CustomTooltipUi>
                                <CustomTooltipUi title="Duplicar paquete">
                                    <button
                                        type="button"
                                        className={styles['icon-btn']}
                                        onClick={() => onDuplicate?.(packageData.id ?? "")}
                                    >
                                        <ContentCopyIcon />
                                    </button>
                                </CustomTooltipUi></>)
                        }

                        <CustomTooltipUi title="Limpiar formulario" placement='bottom'>
                            <button
                                type="button"
                                className={styles['icon-btn']}
                                onClick={() => onClear(packageData.id ?? "")}
                            >
                                <MenuIcon width={16} />
                            </button>
                        </CustomTooltipUi>

                    </div>
                </div>

                <div className={styles['form-group'] + " mb-3"}>
                    <label className={styles['form-group__label']}>Tipo de embalaje*</label>
                    <select
                        name="packageType"
                        value={packageData.packageType}
                        onChange={handlePackageChange}
                        className={getInputClassName('packageType') + " w-50"}
                        disabled={isLoadingPackageTypes}
                    >
                        <option value="">
                            {isLoadingPackageTypes ? 'Cargando tipos...' : 'Selecciona una opción'}
                        </option>

                        {packageTypesError && <option disabled>Error al cargar</option>}

                        {!isLoadingPackageTypes && !packageTypesError && packageTypes.map((type) => (
                            <option key={type.value} value={type.label}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    {errors?.packageType && <span className={styles['error-message']}>{errors.packageType}</span>}
                </div>
                <div className={styles['dimension-input']}>
                    <div className={styles['dimension-input__labels']}>
                        <label className={styles['dimension-input__label']}>Largo*</label>
                        <label className={styles['dimension-input__label']}>Alto*</label>
                        <label className={styles['dimension-input__label']}>Ancho*</label>
                        <label className={styles['dimension-input__label']}>Peso*</label>
                    </div>

                    <div className={`${styles['dimension-input__fields-wrapper']} ${(errors?.lengthCm || errors?.heightCm || errors?.widthCm || errors?.weightKg) ? styles['input--error'] : ''}`}>
                        <div className={styles['dimension-input__field']}>
                            <input
                                type="number"
                                className={`${styles['dimension-input__input']}`}
                                name="lengthCm"
                                value={packageData.lengthCm}
                                onChange={handlePackageChange}
                            />
                            <span className={styles['dimension-input__unit']}>cm</span>
                        </div>

                        <div className={styles['dimension-input__field']}>
                            <input
                                type="number"
                                className={styles['dimension-input__input']}
                                name="heightCm"
                                value={packageData.heightCm}
                                onChange={handlePackageChange}
                            />
                            <span className={styles['dimension-input__unit']}>cm</span>
                        </div>

                        <div className={styles['dimension-input__field']}>
                            <input
                                type="number"
                                className={styles['dimension-input__input']}
                                name="widthCm"
                                value={packageData.widthCm}
                                onChange={handlePackageChange}
                            />
                            <span className={styles['dimension-input__unit']}>cm</span>
                        </div>

                        <div className={styles['dimension-input__field']}>
                            <input
                                type="number"
                                className={styles['dimension-input__input']}
                                name="weightKg"
                                value={packageData.weightKg}
                                onChange={handlePackageChange}
                            />
                            <span className={styles['dimension-input__unit']}>kg</span>
                        </div>
                    </div>
                    {(errors?.lengthCm || errors?.heightCm || errors?.widthCm || errors?.weightKg) && <span className={styles['error-message']}>Las dimencione Largo, Alto, Ancho, Peso son requeridos</span>}
                </div>
                <div className={styles['search-input']} ref={searchContainerRef}>
                    <label className={styles['search-input__label']}>
                        Tipo de producto*
                        <CustomTooltip content={"El Servicio de Administración Tributaria (SAT) requiere el uso del complemento Carta Porte como requisito legal para poder realizar tu envío."}>
                            <InfoIcon className={styles['search-input__info-icon']} />
                        </CustomTooltip>
                    </label>
                    <div className={styles['search-input__wrapper']}>
                        <SearchIcon className={styles['search-input__icon']} />
                        <input
                            type="text"
                            className={`${styles['search-input__input']} ${errors?.productType ? styles['input--error'] : ''}`}
                            name="productType"
                            value={packageData.productType}
                            onChange={handleProductTypeChange}
                            onFocus={() => setDropdownVisible(!!packageData.productType)}
                            placeholder="Busca por palabra clave o número de producto"
                            autoComplete="off"
                        />
                    </div>
                    {errors?.productType && <span className={styles['error-message']}>{errors.productType}</span>}

                    {isDropdownVisible && (
                        <div className={styles['search-input__results']}>
                            {filteredTypes.length > 0 ? (
                                filteredTypes.map(type => (
                                    <div
                                        key={type.uid}
                                        className={styles['search-input__result-item']}
                                        onClick={() => handleSelectProductType(type.name)}
                                    >
                                        {type.name}
                                    </div>
                                ))
                            ) : (
                                <div className={styles['search-input__result-item--no-results']}>
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles['form-row']} style={{ justifyContent: 'space-between', alignItems: 'center' }}>

                    <div className={styles['toggle-switch']}>
                        <input
                            type="checkbox"
                            className={styles['toggle-switch__input']}
                            id={`guardar-${packageData.id}`}
                            name="saveToList"
                            checked={packageData.saveToList}
                            onChange={handlePackageChange}
                        />
                        <label
                            className={styles['toggle-switch__slider']}
                            htmlFor={`guardar-${packageData.id}`}
                        ></label>
                        <label
                            className={styles['toggle-switch__label']}
                            htmlFor={`guardar-${packageData.id}`}
                        >
                            Guardar en lista de paquetes
                        </label>
                    </div>


                    {packageData.saveToList && (
                        <div className={styles['form-group']} style={{ flexBasis: '48%' }}>
                            <label className={styles['form-group__label']}>Alias*</label>
                            <input

                                className={getInputClassName('alias')}
                                type="text"
                                name="alias"
                                value={packageData.alias}
                                onChange={handlePackageChange}
                            />
                            {errors?.alias && <span className={styles['error-message']}>{errors.alias}</span>}
                        </div>
                    )}

                </div>
            </div>

            <div className={styles['package'] + " p-0 mb-4"}>

                <div className={styles['package__products']}>
                    <div className={styles['package__products-header']} onClick={() => setProductsVisible(!isProductsVisible)}>
                        <h4 className={styles['package__products-heading']}>Productos <span className={styles['package__product-count']}>{packageData.items.length} {packageData.items.length == 1 ? 'producto' : 'productos'}</span></h4>
                        <button type="button" className={styles['package__products-header__icon-btn']}>
                            {isProductsVisible ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </button>
                    </div>

                    {isProductsVisible && (
                        <div className={styles['package__products-list']}>
                            {packageData.items.map(product => {
                                const productErrors = errors?.items.find(e => e.id === product.id);
                                return (
                                    <ProductForm
                                        key={product.id}
                                        product={product}
                                        errors={productErrors}
                                        onDelete={(productId) => onDeleteProduct(packageData.id ?? "", productId)}
                                        onUpdate={(productId, field, value) => onUpdateProduct(packageData.id ?? "", productId, field, value)}
                                        onDuplicate={(productId) => onDuplicateProduct(packageData.id ?? "", productId)}
                                        onClear={(productId) => onClearProduct(packageData.id ?? "", productId)}
                                    />
                                )
                            })}
                            <button type="button" onClick={() => onAddProduct(packageData.id ?? "")} className={action == 'add' ? packageData.items.length > 0 ? styles['btn'] : `${styles['btn']} ${styles['btn-no-product']}` : styles['btn--edit']}>
                                <PlusIcon className='me-1' /> <span>Añadir producto</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};