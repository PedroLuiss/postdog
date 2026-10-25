import { useState, ChangeEvent, FormEvent } from 'react';
import { FormValuesReport, ValidationErrors } from '../types'; 

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void;
}

const validate = (values: FormValuesReport): ValidationErrors<FormValuesReport> => {
  const errors: ValidationErrors<FormValuesReport> = {};

  if (!values.tema) {
    errors.tema = 'Debe seleccionar un tema.';
  }

  if (!values.descripcion.trim()) {
    errors.descripcion = 'La descripción es obligatoria.';
  } else if (values.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
  }

  return errors;
};


export const useFormReportProblem = <T extends FormValuesReport>({
  initialValues,
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(values);
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
};