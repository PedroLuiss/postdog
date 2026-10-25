import React from 'react';
import { Package as PackageIcon, Eraser, Copy, Check, ChevronDown, Info, ChevronUp, Plus, Trash2 } from 'lucide-react';
import styles from './PackageForm.module.scss';
import SelectUi from '../../../../ui/SelectUi/SelectUi';
import InputUi from '../../../../ui/Input/InputUi';
import { CustomTooltipUi } from '../../../../ui/CustomTooltipUi';
import ButtonUi from '../../../../ui/Button/ButtonUi';
import PackageProductForm from '../PackageProductForm';
import { usePackageForm } from './hooks/usePackageForm';

import { SATProductSelect } from '../../../../ui/SATProductSelect/SATProductSelect';


interface PackageFormProps {
    index: number;
    id: number;
    showIndex?: boolean;
    onRemove?: () => void;
    onPackageSelected?: () => void;
}

const PackageForm: React.FC<PackageFormProps> = ({ index, id, showIndex, onRemove, onPackageSelected }) => {
    const { 
        pkg, 
        packageOptions,
        isLoadingPackages,
        handleInputChange, 
        volumetricWeight, 
        quotedWeight, 
        handleProductTypeSelect,
        toggleSavePackage,
        toggleShowProducts,
        addProductToPackage,
        clearForm, 
        duplicatePackage,
        packageErrors,
        onSelectSavedPackage
    } = usePackageForm(id , onPackageSelected);

    return (
        <div className={styles['package-form__item']}>
            <div className={styles['package-form__header']}>
                <div className={styles['package-form__title-wrapper']}>
                    <PackageIcon size={20} />
                    <div className={styles['package-form__title-group']}>
                        <h3 className={styles['package-form__title']}>Paquete</h3>
                        {showIndex && (
                            <span className={styles['package-form__package-badge']}>{index + 1}</span>
                        )}
                    </div>
                </div>
                <div className={styles['package-form__actions']}>
                    <button 
                        className={styles['package-form__action-btn']} 
                        title="Limpiar formulario"
                        onClick={clearForm}
                    >
                        <Eraser size={16} />
                    </button>
                    <button 
                        className={styles['package-form__action-btn']} 
                        title="Duplicar paquete"
                        onClick={duplicatePackage}
                    >
                        <Copy size={16} />
                    </button>
                    {onRemove && (
                        <button 
                            className={styles['package-form__action-btn']} 
                            title="Eliminar paquete"
                            onClick={onRemove}
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className={styles['package-form__body']}>
                <div className={styles['field-group']}>
                     <SelectUi 
                        label="Paquete*"
                        placeholder={isLoadingPackages ? "Cargando paquetes..." : "Selecciona un paquete guardado"}
                        options={packageOptions} 
                        value={pkg.savedPackageId || ''}
                        onChange={onSelectSavedPackage}
                        disabled={isLoadingPackages}
                        containerClassName={styles['package-form__select-container']}
                    />
                </div>

                <div className={styles['package-form__grid-3']}>
                    <div className={styles['package-form__field']}>
                        <label className={styles['package-form__label']}>Largo*</label>
                        <div className={styles['package-form__input-container']}>
                            <InputUi 
                                name="length" 
                                type="number" 
                                isInteger
                                value={pkg.length} 
                                onChange={handleInputChange} 
                                suffixIcon={<span className={styles['package-form__unit']}>cm</span>}
                                isValidCircle={(value) => Number(value) > 0}
                                error={packageErrors.length}
                                showMessageError={false}
                            />
                        </div>
                    </div>
                    <div className={styles['package-form__field']}>
                        <label className={styles['package-form__label']}>Ancho*</label>
                        <div className={styles['package-form__input-container']}>
                            <InputUi 
                                name="width"
                                isInteger
                                value={pkg.width}
                                onChange={handleInputChange}
                                isValidCircle={(value) => Number(value) > 0}
                                type="number"
                                suffixIcon={<span className={styles['package-form__unit']}>cm</span>}
                                error={packageErrors.width}
                                showMessageError={false}
                            />
                        </div>
                    </div>
                    <div className={styles['package-form__field']}>
                        <label className={styles['package-form__label']}>Alto*</label>
                        <div className={styles['package-form__input-container']}>
                            <InputUi 
                                name="height"
                                isInteger
                                value={pkg.height}
                                onChange={handleInputChange}
                                isValidCircle={(value) => Number(value) > 0}
                                type="number"
                                suffixIcon={<span className={styles['package-form__unit']}>cm</span>}
                                error={packageErrors.height}
                                showMessageError={false}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles['package-form__grid-3']}>
                    <div className={styles['package-form__field']}>
                        <InputUi 
                            label={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span className={styles['package-form__label']}>Peso*</span>
                                    <CustomTooltipUi variant='red' title="El peso siempre se redondea hacia arriba al kilogramo más cercano">
                                        <button className={styles['package-form__action-btn']} style={{ padding: 0 }}>
                                            <Info size={14} />
                                        </button>
                                    </CustomTooltipUi>
                                </div>
                            }
                            name="weight"
                            isInteger
                            value={pkg.weight}
                            onChange={handleInputChange}
                            isValidCircle={(value) => Number(value) > 0}
                            type="number"
                            containerClassName={styles['package-form__input-container']}
                            suffixIcon={<span className={styles['package-form__unit']}>kg</span>}
                            error={packageErrors.weight}
                            showMessageError={false}
                        />
                    </div>
                    <div className={styles['package-form__field']}>
                        <label className={styles['package-form__label']}>Peso volumétrico</label>
                        <div className={styles['package-form__input-container']}>
                            <InputUi 
                                disabled
                                value={volumetricWeight}
                                type="number"
                                suffixIcon={<span className={styles['package-form__unit']}>kg</span>}
                            />
                        </div>
                    </div>
                    <div className={styles['package-form__field']}>
                        <label className={styles['package-form__label']}>Peso a cotizar</label>
                        <div className={styles['package-form__input-container']}>
                            <InputUi 
                                disabled
                                value={quotedWeight}
                                type="number"
                                suffixIcon={<span className={styles['package-form__unit']}>kg</span>}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles['package-form__field']}>
                    <SATProductSelect
                        label="Tipo de producto"
                        required
                        isInfo
                        value={pkg.productTypeCode && pkg.productTypeDescription 
                            ? `${pkg.productTypeCode} - ${pkg.productTypeDescription}` 
                            : pkg.productTypeCode || ''
                        }
                        onSelect={(opt) => {
                            handleProductTypeSelect(opt);
                            if (pkg.savedPackageId) {
                                handleInputChange({ target: { name: 'savedPackageId', value: '' } } as any);
                            }
                        }}
                        error={packageErrors.productTypeCode}
                        showMessageError={false}
                        className={styles['package-form__field-type-product']}
                        messageTooltip='El Servicio de Administración Tributaria (SAT) requiere el uso del complemento Carta Porte como requisito legal para poder realizar tu envío'
                    />
                </div>
                        
                <div className={styles['checkbox-section']}>
                    <div className={styles['checkbox-group']}>
                        <input 
                            type="checkbox" 
                            id={`guardar-paquete-${index}`} 
                            className={styles['checkbox-hidden']}
                            checked={pkg.savePackage}
                            onChange={toggleSavePackage}
                        />
                        <label htmlFor={`guardar-paquete-${index}`} className={styles['checkbox-custom']}>
                            <div className={`${styles['checkbox-box']} ${pkg.savePackage ? styles['checkbox-box--checked'] : ''}`}>
                                {pkg.savePackage && <Check size={12} strokeWidth={4} />}
                            </div>
                            <span className={styles['checkbox-label']}>Guardar en lista de paquetes</span>
                        </label>
                    </div>

                    {pkg.savePackage && (
                        <div className={styles['alias-wrapper']}>
                            <InputUi 
                                label="Alias*"
                                name="alias"
                                value={pkg.alias}
                                onChange={handleInputChange}
                                isValidCircle={(value) => value.trim() !== ''}
                                showMessageError={false}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className={styles['package-form__products-section']}>
                <button 
                    className={styles['package-form__products-toggle']}
                    onClick={toggleShowProducts}
                >
                    <div className={styles['package-form__products-title']}>
                        <span className={styles['package-form__products-title-text']}>Productos</span>
                        {pkg.products.length > 0 && (
                            <span className={styles['package-form__products-badge']}>
                                {pkg.products.length} {pkg.products.length === 1 ? 'producto' : 'productos'}
                            </span>
                        )}
                        {pkg.products.length === 0 && <span className={styles['package-form__products-title-optional']}>· Opcional</span>}
                    </div>
                    {pkg.showProducts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                
                {pkg.showProducts && (
                    <div className={styles['package-form__product-list']}>
                        {pkg.products.map((product, pIndex) => (
                            <PackageProductForm 
                                key={product.id}
                                packageId={pkg.id}
                                productId={product.id}
                                index={pIndex}
                            />
                        ))}
                        <ButtonUi variant="light" icon={<Plus size={16} />} className={styles['package-form__add-product-btn']} onClick={() => addProductToPackage(id)}>
                            Añadir producto
                        </ButtonUi>
                    </div>
                )}
            </div>
        </div>
    );
};


export default PackageForm;
