import { useAddAddress } from '../hooks/useAddAddress';

export interface AddAddressModalProps {
    onClose: () => void;
    hookData: ReturnType<typeof useAddAddress>;
}


export interface AddAddressFormData {
    alias: string;
    label: 'Origen' | 'Destino' | 'Ambas' | '';
    addressLine: string;
    interiorNumber: string;
    postalCode: string;
    colony: string;
    country: string;
    state: string;
    city: string;
    references: string;
    fullName: string;
    phone: string;
    email: string;
    company: string;
    rfc: string;
}

export interface AddAddressFormErrors {
    alias?: string;
    addressLine?: string;
    postalCode?: string;
    colony?: string;
    country?: string;
    state?: string;
    city?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    company?: string;
    rfc?: string;
}
export interface ColonyInfo {
    name: string;
    state: string;
    city: string;
}
