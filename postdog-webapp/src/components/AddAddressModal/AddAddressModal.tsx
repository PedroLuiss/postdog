import React from 'react';




//Styles
import styles from './AddAddressModal.module.scss';

//Icons
import { MapPinIcon, EraserIcon } from '../icons';



//Components
import SelectUi from '../ui/SelectUi/SelectUi';
import InputUi from '../ui/Input/InputUi';
import DrawerModalUi from '../ui/DrawerUi/DrawerModalUi';

//Types
import { AddAddressModalProps } from '../../types/addAddress.type';

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ onClose, hookData }) => {
    const {
        visible,
        formData,

        errors,
        handleInputChange,
        handleLabelChange,
        handleClearForm,
        handleSubmit,
        isPostalCodeInvalid
    } = hookData;

    return (
        <DrawerModalUi
            isOpen={visible}
            onClose={onClose}
            title={hookData.isEditing ? "Editar dirección" : "Agregar dirección"}
            headerActions={
                <div className={styles['drawer-header-actions']}>
                    <button type="button" onClick={handleClearForm} className={styles['drawer-action-btn']} title="Limpiar formulario">
                        <EraserIcon size={20} />
                    </button>
                </div>
            }
            footer={
                <button type="button" onClick={handleSubmit} className={styles['drawer-submit-btn']}>
                    Guardar
                </button>
            }
            maxWidth="672px"
            maxWidthLg="672px"
        >
            <div className={styles['drawer-body']}>
                <form onSubmit={handleSubmit} className={styles['form-content']}>
                    <div className={styles['drawer-section']}>
                        <div className={styles['drawer-section-header']}>
                            <MapPinIcon size={20} color="currentColor" />
                            <h3 className={styles['drawer-section-title']}>Dirección</h3>
                        </div>

                        <InputUi
                            label="Alias*"
                            name="alias"
                            value={formData.alias}
                            onChange={handleInputChange}
                            error={errors.alias}
                            maxLength={30}
                            showCountString
                            isValidCircle={(value) => value.length > 0}
                            containerClassName={styles['alias-container']}
                        />

                        <div className={styles['drawer-form-group']}>
                            <label className={styles['drawer-label']}>Etiqueta</label>
                            <div className={styles['drawer-radio-group']}>
                                {['Origen', 'Destino', 'Ambas'].map((opt) => (
                                    <button
                                        key={opt}
                                        type="button"
                                        className={`${styles['drawer-radio-btn']} ${formData.label === opt ? styles['drawer-radio-btn--active'] : ''}`}
                                        onClick={() => handleLabelChange(opt as any)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className={styles['drawer-grid']}>
                            <InputUi
                                label="Calle y número exterior*"
                                name="addressLine"
                                value={formData.addressLine}
                                onChange={handleInputChange}
                                error={errors.addressLine}
                                maxLength={25}
                                showCountString
                                isValidCircle={(value) => value.length > 0}
                                containerClassName={styles['col-span-2']}
                            />

                            <InputUi
                                label="Número interior"
                                name="interiorNumber"
                                value={formData.interiorNumber}
                                onChange={handleInputChange}
                                maxLength={5}
                                showCountString
                                isValidCircle={(value) => value.length > 0}
                                containerClassName={styles['col-span-1']}
                            />

                            <InputUi
                                label="Código postal*"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                error={errors.postalCode}
                                maxLength={5}
                                showCountString
                                isValid={formData.postalCode.length === 5 && !isPostalCodeInvalid}
                                showBadge={formData.postalCode.length === 5}
                                isValidCircle={(value) => value.length === 5 && !isPostalCodeInvalid}
                                containerClassName={styles['col-span-1']}
                            />



                            {hookData.isColonyManual ? (
                                <InputUi
                                    label="Colonia*"
                                    name="colony"
                                    placeholder="Escribe el nombre de la colonia"
                                    value={formData.colony}
                                    onChange={handleInputChange}
                                    error={errors.colony}
                                    maxLength={30}
                                    showCountString
                                    isValidCircle={(value) => value.length > 0}
                                    containerClassName={`${styles['col-span-2']} ${styles['drawer-input-field']}`}
                                />
                            ) : (
                                <SelectUi
                                    label={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span>Colonia*</span>
                                            {hookData.isLoadingZipCode && <span style={{ fontSize: '10px', color: '#666' }}>Cargando...</span>}
                                        </div>
                                    }
                                    name="colony"
                                    placeholder={hookData.isLoadingZipCode ? "Buscando colonias..." : "Selecciona una colonia"}
                                    options={hookData.colonyOptions}
                                    value={formData.colony}
                                    onChange={handleInputChange}
                                    disabled={hookData.colonyOptions.length === 0 || hookData.isLoadingZipCode}
                                    containerClassName={`${styles['col-span-2']} ${styles['drawer-input-field']}`}
                                    error={errors.colony}
                                />
                            )}

                            <div className={styles['col-span-1']}>
                                <label className={styles['drawer-label']}>País*</label>
                                <select
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className={`${styles['drawer-input']} ${styles['drawer-select']}`}
                                    disabled
                                >
                                    <option value="MX México">🇲🇽 México</option>
                                </select>
                            </div>

                            <InputUi
                                label="Estado*"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                disabled
                                containerClassName={styles['col-span-1']}
                            />

                            <InputUi
                                label="Ciudad*"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                disabled
                                containerClassName={styles['col-span-1']}
                            />

                            <InputUi
                                label="Referencia (Opcional)"
                                name="references"
                                value={formData.references}
                                onChange={handleInputChange}
                                maxLength={25}
                                showCountString
                                isValidCircle={(value) => value.length > 0}
                                containerClassName={styles['col-span-3']}
                            />
                        </div>
                    </div>
                    <div className={`${styles['drawer-section']} ${styles['contact-section']}`}>
                        <div className={styles['drawer-section-header']}>
                            <h3 className={styles['drawer-section-title']}>Contacto</h3>
                        </div>

                        <div className={styles['contact-grid']}>
                            <InputUi
                                label="Nombre completo*"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                error={errors.fullName}
                                maxLength={30}
                                showCountString
                                isValidCircle={(value) => value.length > 0}
                                containerClassName={styles['col-span-full']}
                            />

                            <InputUi
                                label="Teléfono*"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                error={errors.phone}
                                maxLength={10}
                                showCountString
                                isValidCircle={(value) => value.length === 10}
                                containerClassName={styles['col-span-1']}
                                prefix={
                                    <select className={styles['drawer-phone-select']} disabled>
                                        <option value="+52">MX +52</option>
                                    </select>
                                }
                            />

                            <InputUi
                                label="Correo electrónico*"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                error={errors.email}
                                maxLength={30}
                                showCountString
                                isValidCircle={(value) => value.length > 0 && value.includes('@')}
                                containerClassName={styles['col-span-1']}
                            />

                            <InputUi
                                label="Empresa (Opcional)"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                maxLength={30}
                                containerClassName={styles['col-span-1']}
                            />

                            {(formData.label === 'Origen' || formData.label === 'Ambas') && (
                                <InputUi
                                    label="RFC (Opcional)"
                                    name="rfc"
                                    value={formData.rfc}
                                    onChange={handleInputChange}
                                    error={errors.rfc}
                                    maxLength={13}
                                    showCountString
                                    isValidCircle={(value) => value.length === 12 || value.length === 13}
                                    containerClassName={styles['col-span-1']}
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </DrawerModalUi >
    );
};
