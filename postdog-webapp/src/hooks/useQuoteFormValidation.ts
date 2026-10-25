import { useState, useCallback, useEffect } from 'react';
import { QuoteFormData } from '../types';

export type QuoteFormErrors = {
    [K in keyof QuoteFormData]?: string;
};

export const useQuoteFormValidation = (initialData?: Partial<QuoteFormData>) => {
    const [formData, setFormData] = useState<QuoteFormData>(initialData as QuoteFormData || {
        originPostalCode: "",
        destinationPostalCode: "",
        originCountry: "MX",
        destinationCountry: "MX",
        length: "",
        height: "",
        width: "",
        weight: "",
        savedPackageId: "",
    });
    const [errors, setErrors] = useState<QuoteFormErrors>({});

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let sanitizedValue = value;
        if (['length', 'width', 'height', 'weight'].includes(name)) {
            sanitizedValue = value.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: e.target.type === 'number' ? 
                (sanitizedValue === '' ? '' : parseInt(sanitizedValue, 10).toString()) : 
                sanitizedValue,
        }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }, []);

    const updateField = useCallback((name: keyof QuoteFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }, []);

    const validate = useCallback(() => {
        const currentErrors: QuoteFormErrors = {};

        if (!formData.originPostalCode.trim()) {
            currentErrors.originPostalCode = 'Código postal de origen requerido';
        }
        if (!formData.originCountry.trim()) {
            currentErrors.originCountry = 'País de origen requerido';
        }
        if (!formData.destinationPostalCode.trim()) {
            currentErrors.destinationPostalCode = 'Código postal de destino requerido';
        }
        if (!formData.destinationCountry.trim()) {
            currentErrors.destinationCountry = 'País de destino requerido';
        }
        if (Number(formData.length) <= 0 || isNaN(Number(formData.length))) {
            currentErrors.length = 'Longitud requerida y debe ser un número positivo';
        }
        if (Number(formData.height) <= 0 || isNaN(Number(formData.height))) {
            currentErrors.height = 'Altura requerida y debe ser un número positivo';
        }
        if (Number(formData.width) <= 0 || isNaN(Number(formData.width))) {
            currentErrors.width = 'Ancho requerido y debe ser un número positivo';
        }
        if (Number(formData.weight) <= 0 || isNaN(Number(formData.weight))) {
            currentErrors.weight = 'Peso requerido';
        }

        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    }, [formData]);

    const resetForm = useCallback(() => {
        setFormData(initialData as QuoteFormData || {
            originPostalCode: "",
            destinationPostalCode: "",
            originCountry: "MX",
            destinationCountry: "MX",
            length: "",
            height: "",
            width: "",
            weight: "",
            savedPackageId: "",
        });
        setErrors({});
    }, [initialData]);

    return {
        formData,
        errors,
        handleChange,
        updateField,
        validate,
        resetForm,
        setFormData, 
    };
};