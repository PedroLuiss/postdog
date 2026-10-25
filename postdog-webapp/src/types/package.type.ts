export interface IPackage {
  id: string;
  alias: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  volumetricWeight: number;
  billableWeight: number;
  productType: {
    code: string;
    description: string;
  };
  isFavorite: boolean;
}

export interface CreatePackagePayload {
    alias: string;
    productType: string;
    weightKg: number;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
}

export interface UpdatePackagePayload extends CreatePackagePayload {}

export interface PackageResponse {
    uid: string;
    alias: string;
    aliasNormalized: string;
    packageType: string | null;
    productType: string;
    weightKg: string;
    lengthCm: string;
    widthCm: string;
    heightCm: string;
    volumetricWeight: string;
    chargeableWeight: string;
    isFavorite: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface GetPackagesResponse {
    data: PackageResponse[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
