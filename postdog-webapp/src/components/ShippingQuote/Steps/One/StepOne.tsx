import { AddressForm } from './Form/AddressForm';
import PlaceIcon from '@mui/icons-material/Place';
import React from 'react';
import { HouseIcon } from '../../../icons';
import { AddressFormData, AddressFormErrors } from '../../../../types';
import { DataSaveAddress, ZipCodeResponse } from '../../../../types';

interface StepOneProps {
    remitterData: AddressFormData;
    addresseeData: AddressFormData;
    remitterErrors: AddressFormErrors;
    addresseeErrors: AddressFormErrors;
    remitterColonies: ZipCodeResponse[];
    addresseeColonies: ZipCodeResponse[];
    isLoadingRemitterZip: boolean;
    isLoadingAddresseeZip: boolean;
    handleInputChange: (formType: 'remitter' | 'addressee',
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string | boolean } }) => void;
    handleClearForm: (formType: 'remitter' | 'addressee') => void;
    handleAddressSelect: (formType: 'remitter' | 'addressee', address: DataSaveAddress) => void;
}

export const StepOne: React.FC<StepOneProps> = ({
    remitterData,
    addresseeData,
    remitterErrors,
    addresseeErrors,
    remitterColonies,
    addresseeColonies,
    isLoadingRemitterZip,
    isLoadingAddresseeZip,
    handleInputChange,
    handleClearForm,
    handleAddressSelect
}) => (
    <div>

        <div className='mb-3'>

            <AddressForm
                formType="remitter"
                title="Remitente"
                icon={<HouseIcon />}
                formData={remitterData}
                errors={remitterErrors}
                colonies={remitterColonies}
                isLoadingZipCode={isLoadingRemitterZip}
                handleInputChange={(e) => { handleInputChange('remitter', e) }}
                handlePhoneChange={(phone) => handleInputChange('remitter', { target: { name: 'phone', value: phone } })}
                handleToggleChange={(e) => handleInputChange('remitter', { target: { name: 'showAliasField', value: e.target.checked } })}
                handleClearForm={() => handleClearForm('remitter')}
                onAddressSelect={(address) => handleAddressSelect('remitter', address)}
            />
        </div>
        <div>

            <AddressForm
                formType="addressee"
                title="Destinatario"
                icon={<PlaceIcon />}
                formData={addresseeData}
                errors={addresseeErrors}
                colonies={addresseeColonies}
                isLoadingZipCode={isLoadingAddresseeZip}
                handleInputChange={(e) => handleInputChange('addressee', e)}
                handlePhoneChange={(phone) => handleInputChange('addressee', { target: { name: 'phone', value: phone } })}
                handleToggleChange={(e) => handleInputChange('addressee', { target: { name: 'showAliasField', value: e.target.checked } })}
                handleClearForm={() => handleClearForm('addressee')}
                onAddressSelect={(address) => handleAddressSelect('addressee', address)}
            />
        </div>
    </div>
);