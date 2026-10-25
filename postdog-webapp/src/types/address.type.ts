import { Address } from "./order.type";

export type AddressTypeFilter = 'origin' | 'destination' | 'both';

export interface ZipCodeResponse {
    zipCode: string;
    colony: string;
    state: string;
    city: string;
    country: string;
}

export interface DataSaveAddress extends Address {
    id: string;
    createdAt: string;
    updatedAt: string;
    isFavorite?: boolean;
}

export interface CreateAddressDto extends Omit<Address, 'uid'> {
    type: 'origin' | 'destination' | 'both';
}

export type UpdateAddressDto = Partial<CreateAddressDto>;

export interface SavedAddressesProps {
    onAddAddress: () => void;
    addresses: DataSaveAddress[];
    filteredAddresses: DataSaveAddress[];
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedLabel: string;
    setSelectedLabel: (label: 'Origen' | 'Destino' | 'Ambas' | '') => void;
    handleDeleteAddress: (address: DataSaveAddress) => void;
    handleEditAddress: (address: DataSaveAddress) => void;
    toggleFavorite: (address: DataSaveAddress) => void;
    isLoading?: boolean;
    error?: string | null;
}
