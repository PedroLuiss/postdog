import { Address, PackageItem } from "./order.type";
import { FormattedPackaging } from "./quote.type";

export type SortConfig = {
    key: keyof ShippingOption | null;
    direction: 'asc' | 'desc';
};

export interface ShippingOption {
    id: string;
    logo: string;
    carrier: string;
    service: string;
    collection: 'Disponible' | 'No disponible';
    estimatedDelivery: string;
    price: number;
}

export interface ShippingOptionsProps {
    options: ShippingOption[];
    selectedOptionId: string | null;
    onSelectOption: (id: string) => void;
    onSort: (key: 'estimatedDelivery' | 'price') => void;
    sortConfig: {
        key: keyof ShippingOption | null;
        direction: 'asc' | 'desc';
    };
    isFilterOpen: boolean;
    onFilterToggle: () => void;
    onFilterClose: () => void;
    availableCarriers: string[];
    selectedCarriers: string[];
    onFilterChange: (selected: string[]) => void;
}


export interface SelectOptionSavedAddress {
    value: string; 
    title: string;
}

export type AddressFormData = Omit<Address,'type'> &{ showAliasField: boolean; };


export type AddressFormErrors = {
    [K in keyof AddressFormData]?: string;
};



export type ProductFormErrors = Partial<Record<keyof Omit<PackageItem, 'id'>, string>>;

export interface PackageFormErrors {
     id?: string;
    saveToList?: boolean;
    alias?: string;
    packageType?: string;
    productType?: string;
    weightKg?: string;
    lengthCm?: string;
    widthCm?: string;
    heightCm?: string;
    items: (ProductFormErrors & { id: string })[];
}

export interface StepThreeErrors {
  selectedOption?: string;
  declaredValue?: string;
}


export interface ProductType {
   uid: string;
  code: string;
  name: string;
  description: string;
  restrictions: {
    max_width_cm: number;
    max_height_cm: number;
    max_length_cm: number;
    max_weight_kg: number;
  } | null;
}


export interface ShippingQuotePayload {
  remitterData: any;
  addresseeData: any;
  packages: any[];
  shippingOption: any;
  pawSafe: boolean;
  declaredValue: string;
  total: number;
}


export interface ProductData {
  id: number;
  name: string;
  sku: string;
  price: string;
  quantity: string;
}

export interface AddressData {
  street: string;
  internalNumber: string;
  zipCode: string;
  colony: string;
  country: string;
  state: string;
  city: string;
  reference: string;
  fullName: string;
  phone: string;
  email: string;
  company: string;
  rfc: string;
  saveAddress: boolean;
  alias: string;
  savedAddressId?: string;
  customColony?: string;
}

export interface PackageData {
  id: number;
  length: string;
  width: string;
  height: string;
  weight: string;
  productTypeCode: string;
  productTypeDescription: string;
  savePackage: boolean;
  savedPackageId?: string;
  alias: string;
  products: ProductData[];
  showProducts?: boolean;
}

export interface ShipmentState {
  remitter: AddressData;
  addressee: AddressData;
  packages: PackageData[];
  selectedPackaging: any | null; 
  insurance: {                 
    active: boolean;
    declaredValue: string;
    cost: number;
  };
  isDuplicating?: boolean;
  selectedOrder?: any;
  shippingType: 'create' | 'return' | 'duplicate' | 'from_order';
  errors: {
    remitter: Record<string, string>;
    addressee: Record<string, string>;
    packages: Record<number, Record<string, string>>;
  };
}

export interface ShipmentContextType {
  state: ShipmentState;
  updateRemitter: (data: Partial<AddressData>) => void;
  updateAddressee: (data: Partial<AddressData>) => void;
  addPackage: () => void;
  removePackage: (id: number) => void;
  updatePackage: (id: number, data: Partial<PackageData>) => void;
  addProductToPackage: (packageId: number) => void;
  removeProductFromPackage: (packageId: number, productId: number) => void;
  updateProduct: (packageId: number, productId: number, data: Partial<ProductData>) => void;
  resetShipment: () => void;
  clearRemitter: () => void;
  clearAddressee: () => void;
  clearPackage: () => void;
  selectPackaging: (packaging: FormattedPackaging | null) => void;
  updateInsurance: (data: Partial<ShipmentState['insurance']>) => void;
  duplicatePackage: (id: number) => void;
  openModalCreateShipment: () => void;
  closeModalCreateShipment: () => void;
  openCreateReturn: (order: any) => void;
  isModalCreateShipmentOpen: boolean;
  openDuplicateShipment: (order: any) => void;
  openCreateShipmentFromOrder: (order: any) => Promise<void>;
  setErrors: (errors: any) => void;
  isRemitterEditing: boolean;
  setIsRemitterEditing: (isEditing: boolean) => void;
  isAddresseeEditing: boolean;
  setIsAddresseeEditing: (isEditing: boolean) => void;
  isPackageEditing: boolean;
  setIsPackageEditing: (isEditing: boolean) => void;
}


export interface ShipmentHistoryCarrier {
  uid: string;
  carrierCode: string;
  carrierName: string;
  serviceCode: string;
  serviceName: string;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  priceAmount: string;
  logoUrl: string;
  pickupAvailable: boolean;
  trackingAvailable: boolean;
  thermalPrintingAvailable: boolean;
}

export interface ShipmentHistoryAddress {
  fullName: string;
  city: string;
  state: string;
  postalCode: string;
  addressLine?: string;
}

export interface ShipmentHistoryItem {
  uid: string;
  shipmentNumber: number;
  trackingProvisional: string;
  status: string;
  labelStatus: string;
  safeShipping: boolean;
  currency: string;
  totalsGrand: string;
  totalsInsurance: string;
  totalsTaxes: string;
  packagesCount: number;
  createdAt: string;
  cancellationReason: string | null;
  cancellationDetails: string | null;
  carrier: ShipmentHistoryCarrier;
  destinationAddress: ShipmentHistoryAddress;
  originAddress: ShipmentHistoryAddress;
  source?: OriginHistoryShipment;
}

interface OriginHistoryShipment {
  type: string;
  platform: string;
  identifier: string;
  logoUrl: string;
}

export interface ShipmentHistoryResponse {
  data: ShipmentHistoryItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface ShipmentFilterParams {
    page?: number;
    limit?: number;
    search?: string;
    carrier?: string;
    status?: string;
    insurance?: string;
    sort?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
}