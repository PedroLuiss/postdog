import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import BillingService from '../../../services/BillingService';
import { BillingFormData, SelectOption } from '../Type/Billing.Type';
import { useNotification } from '../../../context/NotificationContext';

export interface BillingFormValues {
    profileType: string;
    rfc: string;
    razonSocial: string;
    regimenFiscal: string;
    formaPago: string;
    usoCfdi: string;
    codigoPostal: string;
}

export const useBillingForm = (
    initialData: BillingFormData,
    autoInvoiceEnabled: boolean,
    autoInvoiceType: 'PER_RECHARGE' | 'MONTHLY',
    onSuccess: () => void
) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cpError, setCpError] = useState<string | null>(null);
    const { showNotification } = useNotification();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        trigger,
        setError,
        clearErrors,
        control,
        getValues,
        reset
    } = useForm<BillingFormValues>({
        defaultValues: {
            ...initialData,
            profileType: initialData?.personType === 'MORAL' ? 'moral'
                : initialData?.personType === 'PHYSICAL' ? 'fisica'
                    : initialData?.rfc?.length === 12 ? 'moral' : 'fisica'
        },
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    });

    useEffect(() => {
        reset({
            ...initialData,
            profileType: initialData?.personType === 'MORAL' ? 'moral'
                : initialData?.personType === 'PHYSICAL' ? 'fisica'
                    : initialData?.rfc?.length === 12 ? 'moral' : 'fisica'
        });
    }, [initialData, reset]);

    const profileType = watch('profileType');
    const rfcValue = watch('rfc');
    const cpValue = watch('codigoPostal');

    const [catalogs, setCatalogs] = useState<{
        regimenFiscal: SelectOption[];
        formaPago: SelectOption[];
        usoCfdi: SelectOption[];
    }>({
        regimenFiscal: [],
        formaPago: [],
        usoCfdi: []
    });


    useEffect(() => {
        const loadCatalogs = async () => {
            try {
                const data = await BillingService.getCatalogs();
                setCatalogs({
                    regimenFiscal: data?.regimens?.map(item => ({
                        label: `${item.code} - ${item.name}`,
                        value: item.code
                    })) || [],
                    formaPago: data?.paymentMethods?.map(item => ({
                        label: `${item.code} - ${item.name}`,
                        value: item.code
                    })) || [],
                    usoCfdi: data?.cfdiUses?.map(item => ({
                        label: `${item.code} - ${item.name}`,
                        value: item.code
                    })) || []
                });
            } catch (error) {
                console.error('Error al cargar catálogos de facturación', error);
            }
        };
        loadCatalogs();
    }, []);

    useEffect(() => {
        if (cpValue?.length === 5) {
            const validateCP = async () => {
                const result = await BillingService.validateZipCode(cpValue);
                if (!result.isValid) {
                    setError('codigoPostal', { type: 'manual', message: result.message || 'Código postal inválido' });
                    setCpError(result.message || 'Código postal inválido');
                } else {
                    clearErrors('codigoPostal');
                    setCpError(null);
                }
            };
            validateCP();
        }
    }, [cpValue, setError, clearErrors]);

    const onSubmitForm: SubmitHandler<BillingFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const payload = {
                personType: data.profileType === 'fisica' ? 'PHYSICAL' : 'MORAL',
                rfc: data.rfc,
                businessName: data.razonSocial,
                taxRegime: data.regimenFiscal,
                paymentMethod: data.formaPago,
                cfdiUse: data.usoCfdi,
                postalCode: data.codigoPostal,
                autoInvoiceEnabled: autoInvoiceEnabled,
                autoInvoiceType: autoInvoiceType
            };

            await BillingService.createBillingProfile(payload as any);
            onSuccess();
        } catch (error: any) {
            console.error('Error al guardar datos fiscales', error);

            let errorMsgToShow = 'Ocurrió un error al guardar los datos fiscales.';

            if (error?.response?.data?.errors) {
                const apiErrors = error.response.data.errors;
                if (Array.isArray(apiErrors)) {
                    const firstError = apiErrors[0];
                    if (firstError?.messages && firstError.messages.length > 0) {
                        errorMsgToShow = firstError.messages[0];
                    }

                    apiErrors.forEach((errObj: any) => {
                        const fieldName = errObj.field;
                        const message = errObj.messages ? errObj.messages[0] : 'Error';

                        const fieldMapping: Record<string, keyof BillingFormValues> = {
                            'businessName': 'razonSocial',
                            'taxRegime': 'regimenFiscal',
                            'paymentMethod': 'formaPago',
                            'cfdiUse': 'usoCfdi',
                            'postalCode': 'codigoPostal'
                        };
                        const formFieldName = fieldMapping[fieldName] || fieldName;
                        setError(formFieldName as any, { type: 'manual', message: message });
                    });
                } else {
                    const firstErrorKey = Object.keys(apiErrors)[0];
                    if (firstErrorKey) {
                        const val = apiErrors[firstErrorKey];
                        errorMsgToShow = typeof val === 'string' ? val : (val.messages ? val.messages[0] : JSON.stringify(val));
                    }

                    Object.keys(apiErrors).forEach((key) => {
                        const val = apiErrors[key];
                        const message = typeof val === 'string' ? val : (val.messages ? val.messages[0] : 'Error');

                        const fieldMapping: Record<string, keyof BillingFormValues> = {
                            'businessName': 'razonSocial',
                            'taxRegime': 'regimenFiscal',
                            'paymentMethod': 'formaPago',
                            'cfdiUse': 'usoCfdi',
                            'postalCode': 'codigoPostal'
                        };
                        const formFieldName = fieldMapping[key] || key;
                        setError(formFieldName as any, { type: 'manual', message: message });
                    });
                }
            } else if (error?.response?.data?.message) {
                errorMsgToShow = error.response.data.message;
            } else if (error?.message) {
                errorMsgToShow = error.message;
            }

            showNotification('Error guardando', errorMsgToShow, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(onSubmitForm) as (e?: React.BaseSyntheticEvent) => Promise<void>,
        errors,
        profileType,
        setProfileType: (type: 'fisica' | 'moral') => {
            setValue('profileType', type);
            if (type === 'moral') {
                const currentRfc = getValues('rfc') || '';
                if (currentRfc.length > 12) {
                    setValue('rfc', currentRfc.substring(0, 12));
                }
            }
            clearErrors('rfc');
        },
        catalogs,
        isSubmitting,
        cpError,
        rfcValue,
        setValue,
        trigger,
        control,
        watch
    };
};
