import React from 'react';
import { Eraser, Trash2 } from 'lucide-react';
import styles from './PackageProductForm.module.scss';
import InputUi from '../../../../ui/Input/InputUi';
import { usePackageProductForm } from './hooks/usePackageProductForm';

interface PackageProductFormProps {
    packageId: number;
    productId: number;
    index: number;
}

const PackageProductForm: React.FC<PackageProductFormProps> = ({ packageId, productId, index }) => {
    const { 
        product, 
        handleChange, 
        handleClear, 
        handleRemove 
    } = usePackageProductForm(packageId, productId);

    if (!product) return null;

    return (
        <div className={styles['package-form__product-item']}>
            <div className={styles['package-form__product-header']}>
                <span className={styles['package-form__product-title']}>Producto {index + 1}</span>
                <div className={styles['package-form__actions']}>
                    <button 
                        className={styles['package-form__action-btn']} 
                        title="Limpiar formulario"
                        onClick={handleClear}
                        type="button"
                    >
                        <Eraser size={14} />
                    </button>
                    <button 
                        className={styles['package-form__action-btn']} 
                        title="Eliminar producto"
                        onClick={handleRemove}
                        type="button"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>
            
            <div className={styles['package-form__product-grid']}>
                <div className={styles['package-form__field']}>
                    <InputUi 
                        label={<span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 400 }}>Nombre del producto</span>}
                        value={product.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        containerClassName={styles['package-form__input-container']}
                    />
                </div>
                <div className={styles['package-form__field']}>
                    <InputUi 
                        label={<span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 400 }}>SKU</span>}
                        value={product.sku}
                        onChange={(e) => handleChange('sku', e.target.value)}
                        containerClassName={styles['package-form__input-container']}
                    />
                </div>
                <div className={styles['package-form__field']}>
                    <InputUi 
                        label={<span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 400 }}>Precio</span>}
                        type="number"
                        containerClassName={styles['package-form__input-container']}
                        suffixIcon={<span style={{ fontSize: '0.75rem', color: '#374151' }}>MXN</span>}
                        value={product.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                    />
                </div>
                <div className={styles['package-form__field']}>
                    <InputUi 
                        label={<span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: 400 }}>Cantidad</span>}
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        containerClassName={styles['package-form__input-container']}
                    />
                </div>
            </div>
        </div>
    );
};

export default PackageProductForm;
