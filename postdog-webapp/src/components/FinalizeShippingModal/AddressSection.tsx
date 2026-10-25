import React from 'react';
import styles from './FinalizeShippingModal.module.scss';
import { AddressFormData, AddressFormErrors } from '../../types';
import { StepOne } from '../ShippingQuote/Steps/One/StepOne';
import { EditIcon, HouseIcon } from '../icons';
import PlaceIcon from '@mui/icons-material/Place';
import { DataSaveAddress, ZipCodeResponse } from '../../types';

interface Props {
    isEditing: boolean;
    remitterData: AddressFormData;
    addresseeData: AddressFormData;
    remitterErrors: AddressFormErrors;
    addresseeErrors: AddressFormErrors;
    remitterColonies: ZipCodeResponse[];
    addresseeColonies: ZipCodeResponse[];
    isLoadingRemitterZip: boolean;
    isLoadingAddresseeZip: boolean;
    handlers: {
        onEdit: () => void;
        onCancel: () => void;
        onSave: () => void;
        onInputChange: (formType: 'remitter' | 'addressee', event: any) => void;
        onClearForm: (formType: 'remitter' | 'addressee') => void;
        handleAddressSelect: (formType: "remitter" | "addressee", selectedAddress: DataSaveAddress) => void;
    }
}

export const AddressSection: React.FC<Props> = ({
    isEditing,
    remitterData,
    addresseeData,
    remitterErrors,
    addresseeErrors,
    remitterColonies,
    addresseeColonies,
    isLoadingRemitterZip,
    isLoadingAddresseeZip,
    handlers
}) => (
    <section className={styles['address-info']}>
        {isEditing ? (
            <div className={styles['address-info__form-container']}>
                <StepOne
                    remitterData={remitterData}
                    addresseeData={addresseeData}
                    remitterErrors={remitterErrors}
                    addresseeErrors={addresseeErrors}
                    remitterColonies={remitterColonies}
                    addresseeColonies={addresseeColonies}
                    isLoadingRemitterZip={isLoadingRemitterZip}
                    isLoadingAddresseeZip={isLoadingAddresseeZip}
                    handleInputChange={handlers.onInputChange}
                    handleClearForm={handlers.onClearForm}
                    handleAddressSelect={handlers.handleAddressSelect}
                />
                <div className={styles['address-info__form-actions']}>
                    <button onClick={handlers.onCancel} className={`${styles['address-info__form-actions--cancel']}`}>
                        Cancelar
                    </button>
                    <button onClick={handlers.onSave} className={`${styles['finalize-shipping__button']} ${styles['finalize-shipping__button--primary']}`}>
                        Guardar Cambios
                    </button>
                </div>
            </div>
        ) : (
            <>
                <div className={styles['address-info__column']}>
                    <div className={styles['address-info__header']}>
                        <HouseIcon />
                        <h3 className={styles['address-info__title']}>Remitente</h3>
                    </div>
                    <div className={styles['address-info__content']}>
                        <p>{remitterData.fullName} | Casa | 88776 - Villas de Imaq</p>
                        <p>{remitterData.interiorNumber}, Reynosa, Tamaulipas, México</p>
                    </div>
                </div>
                <div className={styles['address-info__column']}>
                    <div className={styles['address-info__header']}>
                        <PlaceIcon />
                        <h3 className={styles['address-info__title']}>Destinatario</h3>
                    </div>
                    <div className={styles['address-info__content']}>
                        <p>{addresseeData.fullName} | 83288 - Villa Bonita</p>
                        <p>{addresseeData.interiorNumber}, Hermosillo, Sonora, México</p>
                    </div>
                </div>
                <button onClick={handlers.onEdit} className={styles['address-info__edit-button']}>
                    <EditIcon /> Editar
                </button>
            </>
        )}
    </section>
);