
import React from 'react';
import styles from './ReportProblemPage.module.scss';
import { ReportProblemForm } from '../../components/ReportProblemForm/ReportProblemForm';
import { FormValuesReport } from '../../types';
import { useSendReportProblem } from '../../hooks/useSendReportProblem';
import CheckIcon from '@mui/icons-material/Check';
import { Alert } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from "react-router-dom";

export const ReportProblemPage: React.FC = () => {

  const { data, error, isLoading, execute } = useSendReportProblem();

  const handleFormSubmit = (formData: FormValuesReport) => {
    execute(formData);
  };
  const navigate = useNavigate();

  return (
    <div className={styles['report-problem-page']}>
      <div className={styles['report-problem-page__info']}>
        <p>
          Cuéntanos si tienes dudas, comentarios o algún problema con la plataforma. Para reportar incidencias con un envío, entra a{' '}
          <a onClick={() => navigate("/shipping/orders")} className={styles['report-problem-page__highlight']}>Historial de envíos</a> y selecciona el envío afectado.
        </p>
        <p>
          Si necesitas ayuda general o soporte adicional, escríbenos a:{' '}
          <a href="mailto:soporte@postdog.com" className={styles['report-problem-page__highlight']}>
            soporte@postdog.com
          </a>
        </p>
      </div>

      {!isLoading && data && (
        <Alert icon={<CheckIcon fontSize="inherit" />} className='w-100 mb-3' severity="success">
          {data.message}
        </Alert>
      )}
      {!isLoading && error && (
        <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} className='w-100 mb-3' severity="error">
          {error.message}
        </Alert>
      )}

      <ReportProblemForm loading={isLoading} onFormSubmit={handleFormSubmit} />
    </div>
  );
};