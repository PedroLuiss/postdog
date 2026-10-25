import React from 'react';
import styles from './ReportProblemForm.module.scss';
import { useFormReportProblem } from '../../hooks/useFormReportProblem';
import { FormValuesReport } from '../../types';
import { CircularProgress } from '@mui/material';

interface ReportProblemFormProps {
    onFormSubmit: (data: FormValuesReport) => void;
    loading?: boolean
}

export const ReportProblemForm: React.FC<ReportProblemFormProps> = ({ onFormSubmit, loading = false }) => {
    const { values, errors, handleChange, handleSubmit } = useFormReportProblem({
        initialValues: {
            tema: '',
            descripcion: '',
        },
        onSubmit: onFormSubmit,
    });

    return (
        <form className={styles['report-form']} onSubmit={handleSubmit} noValidate>
            <div className={styles['report-form__field']}>
                <label htmlFor="tema" className={styles['report-form__label']}>
                    Tema
                </label>
                <div className={styles['report-form__select-wrapper']}>
                    <select
                        id="tema"
                        name="tema"
                        value={values.tema}
                        onChange={handleChange}
                        className={`${styles['report-form__input']} ${styles['report-form__input__select']} ${errors.tema ? styles['report-form__input--error'] : ''}`}
                    >
                        <option value="" disabled>
                            Selecciona una opción
                        </option>
                        <option value="duda">Duda sobre la plataforma</option>
                        <option value="problema_tecnico">Problema técnico</option>
                        <option value="sugerencia">Sugerencia de mejora</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                {errors.tema && <span className={styles['report-form__error']}>{errors.tema}</span>}
            </div>

            <div className={styles['report-form__field']}>
                <label htmlFor="descripcion" className={styles['report-form__label']}>
                    Describe la situación
                </label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    value={values.descripcion}
                    onChange={handleChange}
                    className={`${styles['report-form__input']} ${styles['report-form__input--textarea']} ${errors.descripcion ? styles['report-form__input--error'] : ''}`}
                    placeholder="Ingresar texto..."
                    rows={8}
                />
                {errors.descripcion && <span className={styles['report-form__error']}>{errors.descripcion}</span>}
            </div>

            <div className={styles['report-form__actions']}>
                <button type="submit" className={styles['report-form__button']}>
                    {
                        loading
                            ? (<><CircularProgress color='inherit' size="1.5rem" /> Enviando...</>)
                            : " Enviar "
                    }
                </button>
            </div>
        </form>
    );
};