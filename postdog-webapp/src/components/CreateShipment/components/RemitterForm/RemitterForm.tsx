import React from 'react';
import { Check } from 'lucide-react';
import styles from './RemitterForm.module.scss';
import InputUi from '../../../ui/Input/InputUi';
import SelectUi from '../../../ui/SelectUi/SelectUi';
import { useRemitterForm } from './hooks/useRemitterForm';

interface RemitterFormProps {
    onAddressSelected?: () => void;
}

const RemitterForm: React.FC<RemitterFormProps> = ({ onAddressSelected }) => {
    const { 
        remitter, 
        addressOptions,
        selectedAddressId,
        isLoadingAddresses,
        handleSelectSavedAddress,
        handleChangeValue, 
        handleZipCodeChange, 
        handlePhoneChange, 
        toggleSaveAddress,
        colonyOptions,
        isLoadingZipCode,
        remitterErrors,
        isCustomColony
    } = useRemitterForm();

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
                    label="Direcciones guardadas"
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
                        value={remitter.street}
                        name="street"
                        onChange={handleChangeValue}
                        error={remitterErrors.street}
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
                        value={remitter.internalNumber}
                        name="internalNumber"
                        onChange={handleChangeValue}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                <div>
                    <InputUi 
                        label="Código postal*"
                        maxLength={5}
                        showCountString
                        isValidCircle={(value) => value.length === 5}
                        value={remitter.zipCode}
                        name="zipCode"
                        onChange={handleZipCodeChange}
                        error={remitterErrors.zipCode}
                        showMessageError={false}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                {!isCustomColony ? (
                    <div className={styles['grid--span-2']}>
                        <SelectUi 
                            label="Colonia*"
                            placeholder={isLoadingZipCode ? "Cargando..." : (colonyOptions.length > 0 ? "Selecciona una colonia" : "Ingresa código postal")}
                            options={colonyOptions}
                            value={remitter.colony}
                            name="colony"
                            onChange={handleChangeValue}
                            disabled={isLoadingZipCode || colonyOptions.length === 0}
                            error={remitterErrors.colony}
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
                            value={remitter.colony === 'Otro' ? (remitter.customColony || '') : remitter.colony}
                            name={remitter.colony === 'Otro' ? "customColony" : "colony"}
                            onChange={handleChangeValue}
                            error={remitterErrors.customColony || remitterErrors.colony}
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
                        value={remitter.country}
                        name="country"
                        onChange={handleChangeValue}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
                <div>
                    <InputUi 
                        label="Estado*" 
                        disabled 
                        value={remitter.state} 
                        name="state" 
                        error={remitterErrors.state}
                        showMessageError={false}
                        containerClassName={styles['field-group__input-container']} 
                    />
                </div>
                <div>
                    <InputUi 
                        label="Ciudad*" 
                        disabled 
                        value={remitter.city} 
                        name="city" 
                        error={remitterErrors.city}
                        showMessageError={false}
                        containerClassName={styles['field-group__input-container']} 
                    />
                </div>
                <div className={styles['grid--full']}>
                    <InputUi 
                        label="Referencia (Opcional)"
                        maxLength={25}
                        showCountString
                        isValidCircle={(value) => value.length > 0}
                        value={remitter.reference}
                        name="reference"
                        onChange={handleChangeValue}
                        containerClassName={styles['field-group__input-container']}
                    />
                </div>
            </div>

            <div className={styles['sub-section']}>
                <h4 className={styles['sub-section-title']}>Información del remitente</h4>
                <div className={styles['sub-section-grid']}>
                    <div>
                        <InputUi 
                            label="Nombre completo*"
                            maxLength={30}
                            showCountString
                            isValidCircle={(value) => value.length > 0}
                            value={remitter.fullName}
                            name="fullName"
                            onChange={handleChangeValue}
                            error={remitterErrors.fullName}
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
                            />
                            <InputUi 
                                containerClassName={styles['phone-field__input']}
                                maxLength={10}
                                showCountString
                                isValidCircle={(value) => value.length === 10}
                                value={remitter.phone}
                                name="phone"
                                onChange={handlePhoneChange}
                                error={remitterErrors.phone}
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
                            value={remitter.email}
                            name="email"
                            onChange={handleChangeValue}
                            error={remitterErrors.email}
                            showMessageError={false}
                            containerClassName={styles['field-group__input-container']}
                        />
                    </div>
                    <div>
                        <InputUi 
                            label="Empresa (Opcional)"
                            value={remitter.company}
                            name="company"
                            onChange={handleChangeValue}
                            containerClassName={styles['field-group__input-container']}
                        />
                    </div>
                    <div className={styles['grid-column-full']}>
                        <InputUi 
                            label="RFC (Opcional)"
                            maxLength={13}
                            minLength={12}
                            showCountString
                            isValidCircle={(value) => value.length >= 12 && value.length <= 13}
                            value={remitter.rfc}
                            name="rfc"
                            onChange={handleChangeValue}    
                            error={remitterErrors.rfc}
                            showMessageError={false}
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
                            id="guardar-remitente" 
                            className={styles['checkbox-hidden']}
                            checked={remitter.saveAddress}
                            onChange={toggleSaveAddress}
                        />
                        <label htmlFor="guardar-remitente" className={styles['checkbox-custom']}>
                            <div className={`${styles['checkbox-box']} ${remitter.saveAddress ? styles['checkbox-box--checked'] : ''}`}>
                                {remitter.saveAddress && <Check size={12} strokeWidth={4} />}
                            </div>
                            <span className={styles['checkbox-label']}>Guardar en lista de direcciones</span>
                        </label>
                    </div>
                    
                    {remitter.saveAddress && (
                        <div className={styles['alias-wrapper']}>
                            <InputUi 
                                label="Alias*"
                                value={remitter.alias}
                                name="alias"
                                onChange={handleChangeValue}
                                error={remitterErrors.alias}
                                showMessageError={false}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default RemitterForm;