import React from 'react';
import styles from './LabelsForm.module.scss';
import { RadioUi } from '../../ui/SelectionUi';
import SwitchUi from '../../ui/SwitchUi/SwitchUi';
import ButtonUi from '../../ui/Button/ButtonUi';
import { useLabelsForm } from './hooks/useLabelsForm';
import { LabelsFormSkeleton } from '../../ui/SkeletonUi/LabelsFormSkeleton/LabelsFormSkeleton';

export const LabelsForm: React.FC = () => {
  const {
    format,
    downloadPdf,
    isLoading,
    isSaving,
    handleFormatChange,
    handleDownloadPdfChange,
    handleSave,
  } = useLabelsForm();

  if (isLoading) return <LabelsFormSkeleton />;

  return (
    <div className={styles['labels__card']}>
      <div className={styles['labels__container']}>
        
        <section className={styles['labels__section']}>
          <h3 className={styles['labels__section-title']}>Formato</h3>
          
          <div className={styles['labels__group']}>
            <div className={styles['labels__item']}>
              <RadioUi 
                label="Impresora térmica (4×6 pulgadas)"
                name="printFormat"
                value="termica"
                checked={format === 'termica'}
                onChange={handleFormatChange}
                className={styles['labels__radio']}
              />
              <p className={styles['labels__help-text']}>
                En caso de no ser compatible con impresora térmica, usaremos una impresora común para imprimir tu guía.
              </p>
            </div>

            <div className={styles['labels__item']}>
              <RadioUi 
                label="Impresora estándar (8.5×11 pulgadas)"
                name="printFormat"
                value="estandar"
                checked={format === 'estandar'}
                className={styles['labels__radio']}
                onChange={handleFormatChange}
              />
            </div>
          </div>
        </section>

        <hr className={styles['labels__divider']} />

        <section className={styles['labels__section']}>
          <h3 className={styles['labels__section-title']}>Información del pedido</h3>
          
          <div className={styles['labels__item']}>
            <SwitchUi 
              label={
                <span className={styles['labels__item_label']}>
                  Descargar PDF con la información del pedido
                </span>
              }
              checked={downloadPdf}
              onChange={handleDownloadPdfChange}
              id="descargar-pdf"
            />
            <p className={`${styles['labels__help-text']} ${styles['labels__help-text--checkbox']}`}>
              Disponible solo para operaciones e-commerce.
            </p>
          </div>
        </section>

        <div className={styles['labels__footer']}>
          <ButtonUi 
            className={styles['labels__button']}
            variant="primary" 
            onClick={handleSave}
            isLoading={isSaving}
          >
            Guardar
          </ButtonUi>
        </div>

      </div>
    </div>
  );
};