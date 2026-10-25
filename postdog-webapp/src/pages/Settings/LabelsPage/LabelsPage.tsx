import React from 'react';
import styles from './LabelsPage.module.scss';
import { LabelsForm } from '../../../components/Labels/LabelsForm';

export const LabelsPage = () => {
  return (
    <div className={styles['labels']}>
      <div className={styles['labels__header']}>
        <p className={styles['labels__description']}>
          Elige el formato de impresión de tus guías.
        </p>
      </div>

      <LabelsForm />
    </div>
  );
};