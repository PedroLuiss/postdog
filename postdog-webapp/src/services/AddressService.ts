import { ApiResponse, DataSaveAddress, AddressTypeFilter, ZipCodeResponse, CreateAddressDto, UpdateAddressDto } from "../types";
import { HttpService } from "./apiClient";

const AddressServices = {
    /**
     * Obtiene las direcciones guardadas del usuario desde la API.
     * @param type - Opcional. Filtra por tipo de dirección.
     * @returns Una promesa con el arreglo de direcciones.
     */
    getSavedAddressesServices: async (type?: AddressTypeFilter): Promise<DataSaveAddress[]> => {
        const url = type ? `/addresses?type=${type}` : '/addresses';
        const response = await HttpService.get<ApiResponse<DataSaveAddress>>(url);
        return response.data || [];
    },

    addAddressService: async (address: CreateAddressDto): Promise<DataSaveAddress> => {
        const response = await HttpService.post<DataSaveAddress, CreateAddressDto>('/addresses', address);
        return response;
    },

    updateAddressService: async (uid: string, address: UpdateAddressDto): Promise<DataSaveAddress> => {
        const response = await HttpService.put<DataSaveAddress, UpdateAddressDto>(`/addresses/${uid}`, address);
        return response;
    },

    deleteAddressService: async (uid: string): Promise<void> => {
        await HttpService.delete<void>(`/addresses/${uid}`);
    },

    toggleFavoriteService: async (uid: string): Promise<DataSaveAddress> => {
        const response = await HttpService.patch<DataSaveAddress, {}>(`/addresses/${uid}/favorite`, {});
        return response;
    },

    getSavedAddressesAllServices: async (type: string): Promise<DataSaveAddress[]> => {
        const url = `/addresses?paginate=false&type=${type}`;
        const response = await HttpService.get<DataSaveAddress[] | ApiResponse<DataSaveAddress>>(url);
        
        if (Array.isArray(response)) {
            return response;
        }
        
        return (response as ApiResponse<DataSaveAddress>).data || [];
    },

    getZipCodeData: async (zipCode: string): Promise<ZipCodeResponse[]> => {
        try {
            const response = await HttpService.get<{
                state: string;
                city: string;
                colonies: string[];
                country: string;
            }>(`/postal-codes/${zipCode}`);

            const mappedResponse: ZipCodeResponse[] = response.colonies.map(colony => ({
                zipCode: zipCode,
                colony: colony,
                state: response.state,
                city: response.city,
                country: response.country
            }));
            return mappedResponse;
        } catch (error) {
            throw error;
        }
    },

    getFavoriteAddressService: async (): Promise<DataSaveAddress | null> => {
        const response = await HttpService.get<DataSaveAddress | null>('/addresses/favorite');
        return response;
    }
};

export default AddressServices;