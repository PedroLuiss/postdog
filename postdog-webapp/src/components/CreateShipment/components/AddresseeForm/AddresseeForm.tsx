import React from 'react';
import { Check, Info } from 'lucide-react';
import styles from './AddresseeForm.module.scss';
import InputUi from '../../../ui/Input/InputUi';
import SelectUi from '../../../ui/SelectUi/SelectUi';
import { useAddresseeForm } from './hooks/useAddresseeForm';
import { CustomTooltipUi } from '../../../ui/CustomTooltipUi';

interface AddresseeFormProps {
    onAddressSelected?: () => void;
}

const AddresseeForm: React.FC<AddresseeFormProps> = ({ onAddressSelected }) => {
    const {
        addressee,
        isLoadingAddresses,
        addressOptions,
        selectedAddressId,
        handleSelectSavedAddress,
        handleChange,
        handleZipCodeChange,
        handlePhoneChange,
        toggleSaveAddress,
        colonyOptions,
        isLoadingZipCode,
        addresseeErrors,
        isCustomColony
    } = useAddresseeForm();

    const onSelectSavedAddress = (e: any) => {
        handleSelectSavedAddress(e);
        if (onAddressSelected) {
            onAddressSelected();
        }
    };

    const isRealAddressSelected = selectedAddressId && !String(selectedAddressId).startsWith('zip-');

    return (
        <>
            <div className={styles['field-group']}>
                <SelectUi 
                    label="Seleccionar dirección guardada"
                    placeholder={isLoadingAddresses ? "Cargando direcciones..." : "Selecciona una dirección"}
                    options={addressOptions}
                    name="savedAddressSelect"
                    value={selectedAddressId}
                    onChange={onSelectSavedAddress}
                    disabled={isLoadingAddresses}
                    containerClassName={styles['field-group__select-container']}
                />
            </div>

            <div className={styles['grid']}>
                <div className={styles['grid--span-2']}>
                    <InputUi
                        label="Calle y número exterior*"
                        maxLength={25}
                        showCountString
                        isValidCircle={(value) => value.length > 0}
                        name="street"
                        value={addressee.street}
                        onChange={handleChange}
                        error={addresseeErrors.street}
                        showMessageError={false}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                <div>
                    <InputUi
                        label="Número interior"
                        maxLength={5}
                        showCountString
                        isValidCircle={(value) => value.length > 0}
                        name="internalNumber"
                        value={addressee.internalNumber}
                        onChange={handleChange}
                        containerClassName={styles['field-group__input-container']}
                    />  
                </div>
                <div>
                    <InputUi
                        label="Código postal*"
                        maxLength={5}
                        showCountString
                        isValidCircle={(value) => value.length === 5}
                        name="zipCode"
                        value={addressee.zipCode}
                        onChange={handleZipCodeChange}
                        error={addresseeErrors.zipCode}
                        showMessageError={false}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                {!isCustomColony ? (
                    <div className={styles['grid--span-2']}>
                        <SelectUi
                            label="Colonia*"
                            placeholder={isLoadingZipCode ? "Cargando..." : (colonyOptions.length > 0 ? "Selecciona colonia" : "Ingresa código postal")}
                            options={colonyOptions}
                            name="colony"
                            value={addressee.colony}
                            onChange={handleChange}
                            disabled={isLoadingZipCode || colonyOptions.length === 0}
                            error={addresseeErrors.colony}
                            showMessageError={false}
                            containerClassName={styles['field-group__input-container']}
                        />
                    </div>
                ) : (
                    <div className={styles['grid--span-2']}>
                        <InputUi 
                            label="Nombre de la colonia*"
                            placeholder="Escribe el nombre de la colonia"
                            maxLength={30}
                            showCountString
                            isValidCircle={(value) => value.length > 0}
                            value={addressee.colony === 'Otro' ? (addressee.customColony || '') : addressee.colony}
                            name={addressee.colony === 'Otro' ? "customColony" : "colony"}
                            onChange={handleChange}
                            error={addresseeErrors.customColony || addresseeErrors.colony}
                            showMessageError={false}
                            containerClassName={styles['field-group__input-container']}
                        />
                    </div>
                )}
                <div>
                    <SelectUi
                        label="País*"
                        placeholder="🇲🇽 México"
                        disabled
                        options={[{ label: "México", value: "mx" }]}
                        name="country"
                        value={addressee.country}
                        onChange={handleChange}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                <div>
                    <InputUi
                        label="Estado*"
                        disabled
                        name="state"
                        value={addressee.state}
                        onChange={handleChange}
                        error={addresseeErrors.state}
                        showMessageError={false}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                <div>
                    <InputUi
                        label="Ciudad*"
                        disabled
                        name="city"
                        value={addressee.city}
                        onChange={handleChange}
                        error={addresseeErrors.city}
                        showMessageError={false}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                <div className={styles['grid--full']}>
                    <InputUi
                        label={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span className={styles['addressee-form__label']} >Referencia (Opcional)</span>
                                    <CustomTooltipUi variant='red' className={styles['addressee-form__label-tooltip']} title="Si no completas este campo, en la guía se mostrará como 'Ninguna'">
                                        <button  className={styles['addressee-form__label-btn']} >
                                            <Info size={14} />
                                        </button>
                                    </CustomTooltipUi>
                                </div>
                            }
                        maxLength={25}
                        showCountString
                        isValidCircle={(value) => value.length > 0}
                        name="reference"
                        value={addressee.reference}
                        onChange={handleChange}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
            </div>

            <div className={styles['sub-section']}>
                <h4 className={styles['sub-section-title']}>Información del destinatario</h4>
                <div className={styles['sub-section-grid']}>
                    <div>
                        <InputUi
                            label="Nombre completo*"
                            maxLength={30}
                            showCountString
                            isValidCircle={(value) => value.length > 0}
                            name="fullName"
                            value={addressee.fullName}
                            onChange={handleChange}
                            error={addresseeErrors.fullName}
                            showMessageError={false}
                            containerClassName={styles['field-group__input-container']}
                        />
                    </div>
                    <div className={styles['phone-field']}>
                        <label className={styles['phone-field__label']}>Teléfono*</label>
                        <div className={styles['phone-field__content']}>
                            <SelectUi
                                containerClassName={styles['phone-field__select']}
                                options={[]}
                                placeholder="🇲🇽 +52"
                                disabled
                                name="phonePrefix"
                            />
                            <InputUi
                                containerClassName={styles['phone-field__input']}
                                maxLength={10}
                                showCountString
                                isValidCircle={(value) => value.length === 10}
                                name="phone"
                                value={addressee.phone}
                                onChange={handlePhoneChange}
                                error={addresseeErrors.phone}
                                showMessageError={false}
                            />
                        </div>
                    </div>
                    <div>
                        <InputUi
                            label="Correo electrónico*"
                            type="email"
                            maxLength={30}
                            showCountString
                            isValidCircle={(value) => value.length > 0 && value.includes('@')}
                            name="email"
                            value={addressee.email}
                            onChange={handleChange}
                            error={addresseeErrors.email}
                            showMessageError={false}
                            containerClassName={styles['field-group__input-container']}
                        />
                    </div>
                    <div>
                        <InputUi
                            label="Empresa (Opcional)"
                            name="company"
                            value={addressee.company}
                            onChange={handleChange}
                            containerClassName={styles['field-group__input-container']}
                        />
                    </div>
                </div>
            </div>

            {!isRealAddressSelected && (
                <div className={styles['checkbox-section']}>
                    <div className={styles['checkbox-group']}>
                        <input
                            type="checkbox"
                            id="guardar-destinatario"
                            className={styles['checkbox-hidden']}
                            checked={addressee.saveAddress}
                            onChange={toggleSaveAddress}
                        />
                        <label htmlFor="guardar-destinatario" className={styles['checkbox-custom']}>
                            <div className={`${styles['checkbox-box']} ${addressee.saveAddress ? styles['checkbox-box--checked'] : ''}`}>
                                {addressee.saveAddress && <Check size={12} strokeWidth={4} />}
                            </div>
                            <span className={styles['checkbox-label']}>Guardar en lista de direcciones</span>
                        </label>
                    </div>

                    {addressee.saveAddress && (
                        <div className={styles['alias-wrapper']}>
                            <InputUi
                                label="Alias*"
                                name="alias"
                                value={addressee.alias}
                                onChange={handleChange}
                                error={addresseeErrors.alias}
                                showMessageError={false}
                                containerClassName={styles['field-group__input-container']}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default AddresseeForm;