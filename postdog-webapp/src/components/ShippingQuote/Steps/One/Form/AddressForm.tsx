import React from 'react';
import styles from './AddressForm.module.scss';
import { CardLayoutForm } from '../../../../ui/CardLayoutForm/CardLayoutForm';
import { CustomPhoneInputUi } from '../../../../ui/CustomPhoneInputUi';
import { MenuIcon } from '../../../../icons';
import { AddressFormData, AddressFormErrors } from '../../../../../types';
import { useSavedAddresses } from '../../../../../hooks/useSavedAddresses';
import { DataSaveAddress, ZipCodeResponse } from '../../../../../types';


interface AddressFormProps {
    formType: 'remitter' | 'addressee';
    title: string;
    icon: React.ReactNode;
    formData: AddressFormData;
    errors: AddressFormErrors;
    colonies: ZipCodeResponse[];
    isLoadingZipCode?: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handlePhoneChange: (phone: string) => void;
    handleToggleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearForm: () => void;
    onAddressSelect: (address: DataSaveAddress) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
    formType,
    title,
    icon,
    formData,
    errors,
    colonies,
    isLoadingZipCode,
    handleInputChange,
    handlePhoneChange,
    handleToggleChange,
    handleClearForm,
    onAddressSelect
}) => {
    const { addresses: savedAddresses, isLoading: isLoadingAddresses, error } = useSavedAddresses();

    const { showAliasField } = formData;


    const handleSavedAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUid = e.target.value;

        handleInputChange(e);

        if (selectedUid === "") {
            handleClearForm();
            return;
        }

        const selectedAddress = savedAddresses.find(address => address.uid === selectedUid);

        if (selectedAddress) {
            onAddressSelect(selectedAddress);
        }
    };

    const getInputClassName = (fieldName: keyof AddressFormErrors) => {
        return `${styles['remitter-form__input']} ${errors?.[fieldName] ? styles['input--error'] : ''}`;
    };


    const clearButton = (
        <button
            type="button"
            onClick={handleClearForm}
            className={styles['clear-button']}
        >
            <MenuIcon width={16} />
        </button>
    );



    return (
        <CardLayoutForm title={title} icon={icon} actions={[{ icon: clearButton, title: 'Limpiar Formulario' }]}>
            <div className={styles['remitter-form__field'] + ' mb-3'}>
                <label className={styles['remitter-form__label']}>Direcciones guardadas</label>
                <select
                    name="uid"
                    value={formData.uid || ''} // Usar || '' para evitar warnings de componentes no controlados
                    onChange={handleSavedAddressChange} // <-- Usamos el nuevo manejador especializado
                    className={styles['remitter-form__input']}
                    disabled={isLoadingAddresses}
                >
                    <option value="">
                        {isLoadingAddresses ? 'Cargando direcciones...' : 'Selecciona una opción'}
                    </option>

                    {error && <option disabled>Error al cargar</option>}

                    {!isLoadingAddresses && !error && savedAddresses.map((address) => (
                        <option key={address.uid} value={address.uid}>
                            {address.alias}
                        </option>
                    ))}
                </select>
            </div>
            <div className={styles['remitter-form__grid']}>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Calle y número exterior*</label>
                    <input name="addressLine" value={formData.addressLine} onChange={handleInputChange} type="text" className={getInputClassName('addressLine')} />
                    {errors.addressLine && <p className={styles['error-message']}>{errors.addressLine}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>
                        Colonia* {isLoadingZipCode && <span style={{ fontSize: '10px', color: '#666', float: 'right' }}>Cargando...</span>}
                    </label>
                    <select
                        name="colony"
                        value={formData.colony}
                        onChange={handleInputChange}
                        className={getInputClassName('colony')}
                        disabled={isLoadingZipCode || colonies.length === 0}
                    >
                        <option value="">{isLoadingZipCode ? 'Buscando colonias...' : 'Seleccionar colonia'}</option>
                        {colonies.map(c => (
                            <option key={c.colony} value={c.colony}>{c.colony}</option>
                        ))}
                    </select>
                    {errors.colony && <p className={styles['error-message']}>{errors.colony}</p>}
                </div>
            </div>
            <div className={styles['remitter-form__grid--location']}>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Código postal*</label>
                    <input name="postalCode" value={formData.postalCode} onChange={handleInputChange} type="text" className={getInputClassName('postalCode')} />
                    {errors.postalCode && <p className={styles['error-message']}>{errors.postalCode}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Número interior</label>
                    <input name="interiorNumber" value={formData.interiorNumber} onChange={handleInputChange} type="text" className={getInputClassName('interiorNumber')} />
                    {errors.interiorNumber && <p className={styles['error-message']}>{errors.interiorNumber}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Ciudad*</label>
                    <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        type="text"
                        className={getInputClassName('city')}
                        placeholder="Ciudad"
                        disabled
                    />
                    {errors.city && <p className={styles['error-message']}>{errors.city}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Estado*</label>
                    <input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        type="text"
                        className={getInputClassName('state')}
                        placeholder="Estado"
                        disabled
                    />
                    {errors.state && <p className={styles['error-message']}>{errors.state}</p>}
                </div>
            </div>
            <div className={styles['remitter-form__grid']}>

                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>País*</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={getInputClassName('country')}
                    >

                        <option value="México">México</option>
                    </select>
                    {errors.country && <p className={styles['error-message']}>{errors.country}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Referencias*</label>
                    <input name="references" value={formData.references} onChange={handleInputChange} type="text" className={getInputClassName('references')} />
                    {errors.references && <p className={styles['error-message']}>{errors.references}</p>}
                </div>
            </div>
            <h4 className={styles['remitter-form__sub-title']}>{`Información del ${title}`}</h4>
            <div className={styles['remitter-form__grid']}>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Nombre completo*</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className={getInputClassName('fullName')} />
                    {errors.fullName && <p className={styles['error-message']}>{errors.fullName}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Teléfono*</label>
                    <div className={styles['remitter-form__phone-group']}>
                        <CustomPhoneInputUi inputClass={getInputClassName('phone')} value={formData.phone} onChange={handlePhoneChange} />
                    </div>
                    {errors.phone && <p className={styles['error-message']}>{errors.phone}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Correo electrónico*</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} type="email" className={getInputClassName('email')} />
                    {errors.email && <p className={styles['error-message']}>{errors.email}</p>}
                </div>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['remitter-form__label']}>Empresa</label>
                    <input name="company" value={formData.company} onChange={handleInputChange} type="text" className={getInputClassName('company')} />
                    {errors.company && <p className={styles['error-message']}>{errors.company}</p>}
                </div>

                {formType === 'remitter' && (
                    <div className={styles['remitter-form__field']}>
                        <label className={styles['remitter-form__label']}>RFC</label>
                        <input name="rfc" value={formData.rfc} onChange={handleInputChange} type="text" className={getInputClassName('rfc')} />
                        {errors.rfc && <p className={styles['error-message']}>{errors.rfc}</p>}
                    </div>
                )}
            </div>
            <div className={styles['remitter-form__grid']}>
                <div className={styles['remitter-form__field']}>
                    <label className={styles['toggle-switch']}>
                        <input
                            type="checkbox"
                            name="saveAddress"
                            className={styles['toggle-switch__input']}
                            checked={showAliasField}
                            onChange={handleToggleChange}
                        />
                        <span className={styles['toggle-switch__slider']}></span>
                        Guardar en lista de direcciones
                    </label>
                </div>
                {showAliasField && (
                    <div className={styles['remitter-form__field']}>
                        <label className={styles['remitter-form__label']}>Alias*</label>
                        <input name="alias" value={formData.alias || ''} onChange={handleInputChange} type="text" className={getInputClassName('alias')} />
                        {errors.alias && <p className={styles['error-message']}>{errors.alias}</p>}
                    </div>
                )}
            </div>
        </CardLayoutForm>
    );
};