import React from 'react';
import { FileText, Home } from 'lucide-react';
import DrawerModalUi from '../../../ui/DrawerUi/DrawerModalUi';
import InputUi from '../../../ui/Input/InputUi';
import SelectUi from '../../../ui/SelectUi/SelectUi';
import { BillingDrawerProps } from '../../Type/Billing.Type';
import { Controller } from 'react-hook-form';
import { useBillingForm } from '../../Hook/useBillingForm';
import styles from './BillingDrawer.module.scss';

export const BillingDrawer: React.FC<BillingDrawerProps> = ({
    isOpen,
    onClose,
    title,
    formData: initialData,
    autoInvoiceEnabled,
    autoInvoiceType,
    onSuccess
}) => {
    const {
        handleSubmit,
        errors,
        profileType,
        setProfileType,
        catalogs,
        isSubmitting,
        rfcValue,
        control,
        watch
    } = useBillingForm(initialData, autoInvoiceEnabled, autoInvoiceType, () => {
        onSuccess?.();
        onClose();
    });

    return (
        <DrawerModalUi
            className={styles['billing-drawer-root']}
            isOpen={isOpen}
            onClose={onClose}
            title={<h2 className={styles['drawer-title-custom']}>{title || 'Registrar datos fiscales'}</h2>}
            footer={
                <div className={styles['modal-footer-sticky']}>
                    <button
                        type="button"
                        className={styles['btn-submit']}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </button>
                </div>
            }
            maxWidth="672px"
            maxWidthLg="672px"
        >
            <div className={styles['modal-form']}>
                <div className={styles['section-header']}>
                    <FileText size={20} color="#6b7280" />
                    <h3 className={styles['section-title']}>Perfil fiscal</h3>
                </div>

                <div className={styles['info-banner']}>
                    Un último vistazo a tus datos fiscales. Deben coincidir exactamente con los registrados en el <span className={styles['link-sat']}>SAT</span>.
                </div>

                <div className={styles['form-group-tipo-perfil']}>
                    <label className={styles['form-label']}>
                        Tipo de perfil<span className={styles['required-asterisk']}>*</span>
                    </label>
                    <div className={styles['profile-type-group']}>
                        <button
                            type="button"
                            className={`${styles['perfil-selector']} ${profileType === 'fisica' ? styles['perfil-selector--active'] : ''}`}
                            onClick={() => {
                                setProfileType('fisica');
                            }}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Persona física
                        </button>
                        <button
                            type="button"
                            className={`${styles['perfil-selector']} ${profileType === 'moral' ? styles['perfil-selector--active'] : ''}`}
                            onClick={() => {
                                setProfileType('moral');
                            }}
                        >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Persona moral
                        </button>
                    </div>
                </div>

                <div className={styles['form-group-rfc']}>
                    <Controller
                        name="rfc"
                        control={control}
                        rules={{
                            required: 'El RFC es obligatorio',
                            validate: (val, formValues) => {
                                if (formValues.profileType === 'moral' && val?.length !== 12) {
                                    return 'Debe tener 12 caracteres';
                                }
                                if (formValues.profileType === 'fisica' && val?.length !== 13) {
                                    return 'Debe tener 13 caracteres';
                                }
                                return true;
                            }
                        }}
                        render={({ field }) => (
                            <InputUi
                                label={
                                    <span className={styles['form-label']}>
                                        RFC<span className={styles['required-asterisk']}>*</span>
                                    </span>
                                }
                                {...field}
                                error={errors.rfc?.message}
                                showMessageError={false}
                                value={field.value}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase();
                                    field.onChange(val);
                                }}
                                onBlur={field.onBlur}
                                maxLength={watch('profileType') === 'moral' ? 12 : 13}
                                hideCount
                                className={`${styles['form-control']} ${errors.rfc ? styles['input-error'] : ''}`}
                            />
                        )}
                    />
                    <div className={styles['form-helper']}>
                        {errors.rfc ? (
                            <span className={styles['error-text']}>{errors.rfc.message}</span>
                        ) : (
                            <>
                                {watch('profileType') === 'moral' && (
                                    <span className={styles['helper-text']}>Debe tener 12 caracteres</span>
                                )}
                                {watch('profileType') === 'fisica' && (
                                    <span className={styles['helper-text']}>Debe tener 13 caracteres</span>
                                )}
                            </>
                        )}
                        <span className={styles['helper-counter']}>
                            {(rfcValue || '').length}/{watch('profileType') === 'moral' ? 12 : 13}
                        </span>
                    </div>
                </div>

                <div className={styles['form-group-razon-social']}>
                    <Controller
                        name="razonSocial"
                        control={control}
                        rules={{
                            required: 'La razón social es obligatoria',
                            maxLength: { value: 120, message: 'La razón social no debe exceder los 120 caracteres' }
                        }}
                        render={({ field }) => (
                            <InputUi
                                label={
                                    <span className={styles['form-label']}>
                                        Razón social<span className={styles['required-asterisk']}>*</span>
                                    </span>
                                }
                                {...field}
                                error={errors.razonSocial?.message}
                                showMessageError={false}
                                maxLength={120}
                                hideCount
                                className={`${styles['form-control']} ${errors.razonSocial ? styles['input-error'] : ''}`}
                            />
                        )}
                    />
                    <div className={styles['form-helper']}>
                        {errors.razonSocial ? (
                            <span className={styles['error-text']}>{errors.razonSocial.message}</span>
                        ) : (
                            <span className={styles['helper-text']}>
                                {profileType === 'moral' && 'No incluyas conceptos mercantiles (S.A. de C.V., etc.)'}
                            </span>
                        )}
                        <span className={styles['helper-counter']}>
                            {(watch('razonSocial') || '').length}/120
                        </span>
                    </div>
                </div>

                <div className={styles['form-group-regimen']}>
                    <Controller
                        name="regimenFiscal"
                        control={control}
                        rules={{ required: 'El régimen fiscal es obligatorio' }}
                        render={({ field }) => (
                            <SelectUi
                                label={
                                    <span className={styles['form-label']}>
                                        Régimen fiscal<span className={styles['required-asterisk']}>*</span>
                                    </span>
                                }
                                {...field}
                                error={errors.regimenFiscal?.message}
                                showMessageError={false}
                                options={catalogs.regimenFiscal}
                                className={`${styles['select-control']} ${errors.regimenFiscal ? styles['input-error'] : ''}`}
                            />
                        )}
                    />
                    <div className={styles['form-helper']}>
                        {errors.regimenFiscal && (
                            <span className={styles['error-text']}>{errors.regimenFiscal.message}</span>
                        )}
                    </div>
                </div>

                <div className={styles['form-group-pagos']}>
                    <div className={styles['form-group-pagos-col']}>
                        <Controller
                            name="formaPago"
                            control={control}
                            rules={{ required: 'La forma de pago es obligatoria' }}
                            render={({ field }) => (
                                <SelectUi
                                    label={
                                        <span className={styles['form-label']}>
                                            Forma de pago<span className={styles['required-asterisk']}>*</span>
                                        </span>
                                    }
                                    {...field}
                                    error={errors.formaPago?.message}
                                    showMessageError={false}
                                    options={catalogs.formaPago}
                                    placeholder="Selecciona la forma de pago"
                                    className={`${styles['select-control']} ${errors.formaPago ? styles['input-error'] : ''}`}
                                />
                            )}
                        />
                        <div className={styles['form-helper']}>
                            {errors.formaPago && (
                                <span className={styles['error-text']}>{errors.formaPago.message}</span>
                            )}
                        </div>
                    </div>
                    <div className={styles['form-group-pagos-col']}>
                        <Controller
                            name="usoCfdi"
                            control={control}
                            rules={{ required: 'El uso de CFDI es obligatorio' }}
                            render={({ field }) => (
                                <SelectUi
                                    label={
                                        <span className={styles['form-label']}>
                                            Uso de CFDI<span className={styles['required-asterisk']}>*</span>
                                        </span>
                                    }
                                    {...field}
                                    error={errors.usoCfdi?.message}
                                    showMessageError={false}
                                    options={catalogs.usoCfdi}
                                    placeholder="Selecciona el uso de CFDI"
                                    className={`${styles['select-control']} ${errors.usoCfdi ? styles['input-error'] : ''}`}
                                />
                            )}
                        />
                        <div className={styles['form-helper']}>
                            {errors.usoCfdi && (
                                <span className={styles['error-text']}>{errors.usoCfdi.message}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles['section-domicilio']}>
                    <div className={styles['section-header-domicilio']}>
                        <Home size={20} color="#6b7280" />
                        <h3 className={styles['section-title-domicilio']}>Domicilio fiscal</h3>
                    </div>

                    <div className={styles['form-group-cp']}>
                        <Controller
                            name="codigoPostal"
                            control={control}
                            rules={{
                                required: 'El código postal es obligatorio',
                                pattern: {
                                    value: /^[0-9]{5}$/,
                                    message: 'El código postal debe tener exactamente 5 dígitos'
                                }
                            }}
                            render={({ field }) => (
                                <InputUi
                                    label={
                                        <span className={styles['form-label']}>
                                            Código postal<span className={styles['required-asterisk']}>*</span>
                                        </span>
                                    }
                                    {...field}
                                    error={errors.codigoPostal?.message}
                                    showMessageError={false}
                                    maxLength={5}
                                    hideCount
                                    className={`${styles['form-control']} ${errors.codigoPostal ? styles['input-error'] : ''}`}
                                />
                            )}
                        />
                        <div className={styles['form-helper']}>
                            {errors.codigoPostal ? (
                                <span className={styles['error-text']}>{errors.codigoPostal.message}</span>
                            ) : (
                                <span className={styles['helper-text']}>Debe tener 5 dígitos</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DrawerModalUi>
    );
};
