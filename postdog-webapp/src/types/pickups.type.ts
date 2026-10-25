import { Option } from './ui.type';
import { FilterValues, OrderPickups } from './order.type';

export interface ShipmentOption extends Option {
    address: string;
}

export interface SchedulePickupForm {
    carrier: string;
    referenceOrder: string;
    pickupAddress: string;
    pickupDate: string;
}

export interface ScheduledPickup {
    id: string;
    pickupNumber: string;
    carrier: string;
    carrierLogoUrl?: string;
    pickupAddress: string;
    pickupDate: string;
    status?: 'PROGRAMMED' | 'COMPLETED' | 'CANCELLED';
}

export interface SchedulePickupModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: SchedulePickupForm;
    onInputChange: (field: keyof SchedulePickupForm, value: string | number) => void;
    onSubmit: (data: SchedulePickupForm) => void;
    carrierOptions: Option[];
    referenceOrderOptions: Option[];
    pickupDateOptions: Option[];
    isFormValid: boolean;
    isLoading?: boolean;
}

export interface ScheduledPickupsTableProps {
    pickups: ScheduledPickup[];
    isLoading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
}

export interface PickupsListSectionProps {
    pickups: ScheduledPickup[];
    isLoading: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    onProgramarRecoleccion: () => void;
}

export interface PickupsSearchBarProps {
    currentFilters: FilterValues;
    onFiltersChange: (newFilters: FilterValues) => void;
    onApplyFilters: (filters: FilterValues) => void;
    onClearFilters: () => void;
    onRefresh: () => void;
    onSearch: () => void;
    isFilterOpen: boolean;
    setIsFilterOpen: (isOpen: boolean) => void;
}

export interface PickupsTableProps {
    pickups: OrderPickups[];
    isLoading?: boolean;
    error?: string | null;
    onEditOrder?: (order: OrderPickups) => void;
}

export interface PickupsUnauthorizedStateProps {
    title?: string;
    description?: string;
    onAction?: () => void;
}

export const mockScheduledPickups: ScheduledPickup[] = [
    {
        id: '1',
        pickupNumber: '144502',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '2',
        pickupNumber: '144498',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Mañana'
    },
    {
        id: '3',
        pickupNumber: '144500',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '4',
        pickupNumber: '144501',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Mañana'
    },
    {
        id: '5',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '6',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '7',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '8',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '9',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '10',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '11',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '12',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '13',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '14',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '15',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
    {
        id: '16',
        pickupNumber: '144503',
        carrier: 'DHL',
        carrierLogoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
        pickupAddress: 'Priv. Pelícano 15 | Int. 3B\nVillas de Imaq, Reynosa\nTamaulipas, México, 88776',
        pickupDate: 'Hoy'
    },
];

export const mockCarrierOptions: Option[] = [
    { value: 'dhl', label: 'DHL' },
    { value: 'estafeta', label: 'Estafeta' }
];

export const mockShipmentOptions: Record<string, ShipmentOption[]> = {
    'dhl': [
        { value: 'DHL-123', label: 'DHL-123 - Monterrey', address: 'Av. Insurgentes Sur 123, Juárez, CDMX' },
        { value: 'DHL-456', label: 'DHL-456 - Guadalajara', address: 'Calz. Lázaro Cárdenas 456, Jardines del Bosque, Guadalajara, Jal.' },
    ],
    'estafeta': [
        { value: 'EST-789', label: 'EST-789 - CDMX', address: 'Paseo de la Reforma 789, Lomas de Chapultepec, CDMX' },
        { value: 'EST-012', label: 'EST-012 - Queretaro', address: 'Av. 5 de Febrero 012, San Pablo, Querétaro, Qro.' },
    ]
};


export interface PickupAddressApi {
    rfc: string;
    uid: string;
    city: string;
    phone: string;
    state: string;
    colony: string;
    country: string;
    fullName: string;
    postalCode: string;
    addressLine: string;
}

export interface PickupApiItem {
    uid: string;
    carrierCode: string;
    carrierName: string;
    logoUrl: string;
    pickupDate: string;
    pickupAddress: PickupAddressApi;
    createdAt: string;
}

export interface PickupApiMeta {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
}

export interface GetPickupsApiResponse {
    data: PickupApiItem[];
    meta: PickupApiMeta;
}

export interface CreatePickupRequest {
    carrierCode: string;
    referenceShipmentUid: string;
    pickupDate: string;
}