export interface AddressOption {
    id: string;
    alias: string;
    tag: 'Origen' | 'Destino' | 'Ambas';
    addressLine: string;
    interiorNumber?: string;
    colony: string;
    city: string;
    postalCode: string;
    country?: string;
    state?: string;
    references?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    company?: string;
    rfc?: string;
}

export interface AddressSelectUiProps {
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectAddress: (address: AddressOption) => void;
    savedAddresses: AddressOption[];
    icon: React.ReactNode;
    name: string;
    error?: string;
    savedAddressId?: string;
    selectedAlias?: string;
}