
import { CreatePackagePayload, GetPackagesResponse, PackageResponse, UpdatePackagePayload } from '../types';
import { HttpService } from './apiClient';

export interface PackageTypeOption {
    value: string;
    label: string;
}


const PackageService = {
    getPackages: async (page: number = 1, limit: number = 10, search: string = ''): Promise<GetPackagesResponse> => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            ...(search ? { search } : {}),
        });

        return await HttpService.get<GetPackagesResponse>(`/packages?${params.toString()}`);
    },

    getPackagesAll: async (): Promise<PackageResponse[]> => {
        return await HttpService.get<PackageResponse[]>(`/packages?paginate=false`);
    },

    createPackage: async (data: CreatePackagePayload): Promise<PackageResponse> => {
        return HttpService.post<PackageResponse, CreatePackagePayload>('/packages', data);
    },

    updatePackage: async (uid: string, data: UpdatePackagePayload): Promise<PackageResponse> => {
        return HttpService.put<PackageResponse, UpdatePackagePayload>(`/packages/${uid}`, data);
    },

    deletePackage: async (uid: string): Promise<{ success: boolean }> => {
        return HttpService.delete<{ success: boolean }>(`/packages/${uid}`);
    },

    toggleFavorite: async (uid: string): Promise<PackageResponse> => {
        return HttpService.patch<PackageResponse, any>(`/packages/${uid}/favorite`, {
            isFavorite: false
        });
    },

    getPackageTypes: async (): Promise<PackageTypeOption[]> => {
        const packageTypes: PackageTypeOption[] = [
            { value: "caja_carton", label: "Caja de cartón" },
            { value: "sobre_burbuja", label: "Sobre con burbuja" },
            { value: "sobre_papel", label: "Sobre de papel/Kraft" },
            { value: "bolsa_plastica", label: "Bolsa plástica" },
            { value: "caja_madera", label: "Caja de madera" },
            { value: "tubo_carton", label: "Tubo de cartón" },
            { value: "palet", label: "Palet / Tarima" },
            { value: "contenedor", label: "Contenedor rígido" },
            { value: "envoltura_protectora", label: "Envoltura protectora (plástico burbuja, foam, etc.)" },
            { value: "otro", label: "Otro" }
        ];
        return packageTypes;
    },

    getFavoritePackage: async (): Promise<PackageResponse | null> => {
        return await HttpService.get<PackageResponse | null>('/packages/favorite');
    }
};

export default PackageService;