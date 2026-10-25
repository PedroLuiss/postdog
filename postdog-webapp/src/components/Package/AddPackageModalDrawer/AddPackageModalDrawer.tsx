import React from 'react';
import { Drawer } from '@mui/material';
import { X, Eraser } from 'lucide-react';
import styles from './AddPackageDrawer.module.scss';
import InputUi from '../../ui/Input/InputUi';
import { useAddPackageDrawer } from './hooks/useAddPackageDrawer';
import { CustomTooltipUi } from '../../ui/CustomTooltipUi';
import { PackageResponse } from '../../../types';
import { SATProductSelect } from '../../ui/SATProductSelect/SATProductSelect';

interface AddPackageDrawerProps {
  isOpen: boolean;
  onClose: (shouldRefresh: boolean, data?: PackageResponse) => void;
  packageData?: PackageResponse;
}

export const AddPackageDrawer: React.FC<AddPackageDrawerProps> = ({ isOpen, onClose, packageData }) => {
  const {
    formData,
    volumetricWeight,
    quotedWeight,
    isLoading,
    error,
    showErrors,
    errors,
    isEditMode,
    handleChange,
    handleReset,
    handleProductSelect,
    handleSubmit,
  } = useAddPackageDrawer(packageData, isOpen);

  const unitSuffix = (unit: string) => (
    <span className={styles['add-package__unit-text']}>{unit}</span>
  );

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={() => onClose(false)}
      sx={{
        '& .MuiDrawer-paper': {
          borderLeftWidth: '1px',
          width: '100%',
          maxWidth: { xs: '100vw', sm: '42rem' },
          height: '100dvh',
        },
        '& .MuiBackdrop-root': { backgroundColor: '#000c' },
      }}
    >
      <div className={styles['add-package']}>
        <header className={styles['add-package__header']}>
          <div className={styles['add-package__header-content']}>
            <h2 className={styles['add-package__title']}>
              {isEditMode ? 'Editar paquete' : 'Agregar paquete'}
            </h2>
            <div className={styles['add-package__header-actions']}>
              <CustomTooltipUi title={isEditMode ? "Restaurar valores originales" : "Limpiar formulario"}>
                <button className={styles['add-package__icon-btn']} onClick={handleReset}>
                  <Eraser size={20} />
                </button>
              </CustomTooltipUi>
              <button className={styles['add-package__icon-btn-close']} onClick={() => onClose(false)} >
                <X size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className={styles['add-package__body']}>
          <InputUi
            label="Alias*"
            name="alias"
            value={formData.alias}
            onChange={handleChange}
            error={showErrors ? errors.alias : undefined}
            containerClassName={styles['add-package__container-input']}
            showMessageError={false}
            showBadge={showErrors ? true : formData.alias.length > 0}
            isValid={formData.alias.length > 0}
          />

          <div className={styles['add-package__grid']}>
            {['length', 'width', 'height'].map((dim) => (
              <InputUi
                key={dim}
                label={`${dim === 'length' ? 'Largo' : dim === 'width' ? 'Ancho' : 'Alto'}*`}
                name={dim}
                type="number"
                isInteger
                value={(formData as any)[dim]}
                onChange={handleChange}
                error={showErrors ? (errors as any)[dim] : undefined}
                suffixIcon={unitSuffix('cm')}
                containerClassName={styles['add-package__container-input']}
                showMessageError={false}
                showBadge={showErrors ? true : (formData as any)[dim].length > 0}
                isValid={(formData as any)[dim].length > 0}

              />
            ))}
          </div>

          <div className={styles['add-package__grid']}>
            <InputUi
              label="Peso*"
              name="weight"
              type="number"
              isInteger
              value={formData.weight}
              onChange={handleChange}
              error={showErrors ? errors.weight : undefined}
              suffixIcon={unitSuffix('kg')}
              containerClassName={styles['add-package__container-input']}
              showMessageError={false}
              showBadge={showErrors ? true : formData.weight.length > 0}
              isValid={formData.weight.length > 0}
            />
            <InputUi label="Peso Volumétrico" containerClassName={styles['add-package__container-input']} value={volumetricWeight} readOnly suffixIcon={unitSuffix('kg')} />
            <InputUi label="Peso a Cotizar" containerClassName={styles['add-package__container-input']} value={quotedWeight} readOnly suffixIcon={unitSuffix('kg')} />
          </div>

          <div className={styles['add-package__product-type']}>
            <SATProductSelect
              value={formData.productTypeCode && formData.productTypeDescription
                ? `${formData.productTypeCode} - ${formData.productTypeDescription}`
                : formData.productTypeCode
              }
              onSelect={handleProductSelect}
              error={showErrors ? errors.productTypeCode : undefined}
              showMessageError={false}
              className={styles['add-package__product-type-select']}
              messageTooltip="El Servicio de Administración Tributaria (SAT) requiere el uso del complemento Carta Porte como requisito legal para poder realizar tu envío."
            />
          </div>
        </div>

        <footer className={styles['add-package__footer']}>
          {error && <div className={styles['add-package__error-text']}>{error}</div>}
          <button
            className={styles['add-package__submit-btn']}
            disabled={isLoading}
            onClick={() => handleSubmit((data) => onClose(true, data))}
          >
            {isLoading ? 'Procesando...' : isEditMode ? 'Guardar' : 'Guardar'}
          </button>
        </footer>
      </div>
    </Drawer>
  );
};