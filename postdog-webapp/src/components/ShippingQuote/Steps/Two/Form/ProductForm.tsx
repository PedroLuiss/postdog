
import React, { useState } from 'react';
import styles from './style/ProductForm.module.scss';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { MenuIcon } from '../../../../icons';
import { CustomTooltipUi } from '../../../../ui/CustomTooltipUi';
import { PackageItem, ProductFormErrors } from '../../../../../types';

interface ProductFormProps {
    product: PackageItem;
    onDelete: (id: string) => void;
    onUpdate: (id: string, field: keyof PackageItem, value: any) => void;
    onDuplicate: (id: string) => void;
    onClear: (id: string) => void;
    errors?: ProductFormErrors;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onDelete, onUpdate, onDuplicate, onClear, errors }) => {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleDelete = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onDelete(product.id ?? "");
        }, 300); 
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onUpdate(product.id ?? "", name as keyof PackageItem, value);
    };
    const getInputClassName = (fieldName: keyof ProductFormErrors) => {
        return `${styles['form-group__input']} ${errors?.[fieldName] ? styles['input--error'] : ''}`;
    };
    return (
        <div className={`${styles['product']} ${isRemoving ? styles['product--removing'] : ''}`}>
            <div className={styles['product__header']}>
                <div className={styles['product__actions']}>
                    <CustomTooltipUi title="Eliminar producto" placement="top">
                        <button type="button" onClick={handleDelete} className={styles['product__actions__icon-btn']}><DeleteOutlineIcon /></button>
                    </CustomTooltipUi>
                    <CustomTooltipUi title="Duplicar producto" placement="top">
                        <button
                            type="button"
                            onClick={() => onDuplicate(product.id ?? "")}
                            className={styles['product__actions__icon-btn']}
                        >
                            <ContentCopyIcon />
                        </button>
                    </CustomTooltipUi>
                    <CustomTooltipUi title="Limpiar formulario." placement="top">
                        <button
                            type="button"
                            onClick={() => onClear(product.id ?? "")}
                            className={styles['product__actions__icon-btn']}
                        >
                            <MenuIcon width={16} />
                        </button>
                    </CustomTooltipUi>
                </div>
            </div>

            <div className={styles['form-row']}>
                <div className={styles['form-group']} >
                    <label className={styles['form-group__label']}>Nombre del producto</label>
                    <input
                        className={getInputClassName('name')}
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                    />
                    {errors?.name && <span className={styles['error-message']}>{errors.name}</span>}
                </div>
                <div className={styles['form-group']} style={{ flex: 1 }}>
                    <label className={styles['form-group__label']}>SKU</label>
                    <input className={getInputClassName('name')} type="text" name="sku" value={product.sku} onChange={handleChange} />
                    {errors?.sku && <span className={styles['error-message']}>{errors.sku}</span>}
                </div>
            </div>

            <div className={styles['product__form-row-price']}>
                <div className={styles['form-group']}>
                    <label className={styles['form-group__label']}>Precio</label>
                    <div className={`${styles['input-with-addon']} ${errors?.unitPrice ? styles['input--error'] : ''}`} >
                        <span className={styles['input-with-addon__prefix']}>$</span>
                        <input
                            type="number"
                            name="unitPrice"
                            className={styles['input-with-addon__input']}
                            value={product.unitPrice}
                            onChange={handleChange}
                        />
                        <span className={styles['input-with-addon__suffix']}>MXN</span>
                    </div>
                    {errors?.unitPrice && <span className={styles['error-message']}>{errors.unitPrice}</span>}
                </div>
                <div className={styles['form-group']}>
                    <label className={styles['form-group__label']}>Cantidad</label>
                    <input
                        type="number"
                        className={getInputClassName('quantity')}
                        name="quantity"
                        value={product.quantity}
                        onChange={handleChange}
                        placeholder="0"
                    />
                    {errors?.quantity && <span className={styles['error-message']}>{errors.quantity}</span>}
                </div>
            </div>
        </div>
    );
};