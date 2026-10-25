
export interface Shipment {
  id: string;
  sender: { name: string; address: string; };
  recipient: { name: string; address: string; };
  package: { type: string; dimensions: string; weight: string; };
  productsCount: number | 'Pendiente';
  carrier: { id: string; name: string; logo: string; service?: string; };
  services: { code: string; logo: string; };
  status: 'Generada' | 'Ver detalle' | 'Pendiente' | 'Continuar envío';
  date: string;
  time: string;
}

export interface FilterValues {
  searchTerm?: string;
  startDate: string;
  endDate: string;
  statuses: string[];
  stores: string[];
  integrations: string[];
  dateRange?: string[];
}

export interface PaginatedShipmentsResponse {
  data: Shipment[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}


type AddressType = 'origin' | 'destination' | 'both';

export interface Address {
  uid?: string;
  type: AddressType;
  addressLine: string;
  interiorNumber: string;
  colony: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  references: string;
  fullName: string;
  phone: string;
  email: string;
  company: string;
  alias: string;
  rfc: string;
  tag?: string;
}

interface CarrierQuote {
  uid: string;
}

export interface PackageItem {
  id?: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface Package {
  id?: string;
  saveToList?: boolean;
  alias?: string;
  packageType: string;
  productType: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  items: PackageItem[];
}

type ShipmentOrderStatus = 'pending' | 'generated';

export interface ShipmentOrder {
  originAddress: Address;
  destinationAddress: Address;
  currency: string;
  declaredValue: number;
  safeShipping: boolean;
  status: ShipmentOrderStatus;
  selectedCarrierQuote: CarrierQuote;
  packages: Package[];
  shipping_type?: 'create' | 'return' | 'duplicate' | 'from_order';
}


export type DataOrder = {
  uid: string;
  trackingProvisional: string;
  createdAt: string;
  status: "PENDING" | "GENERATED" | "DELIVERED" | string;
  orderNumber: number;
  products: {
    quantity: number;
  };
  originAddress: {
    fullName: string;
    postalCode: string;
    colony: string;
  };
  destinationAddress?: {
    fullName: string;
    postalCode: string;
    colony: string;
    street?: string;
    phone?: string;
    email?: string;
    interiorNumber?: string;
  };
  package: PackageDetails;
  quoteCarrier: CarrierInfo;
  store?: string;
  source?: {
    type: string;
    platform: string;
    identifier: string;
    logoUrl: string;
  };
};


export type OrderPickups = DataOrder;


type PackageDetails = {
  packageType: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
};

type CarrierInfo = {
  carrierName: string;
  logoUrl: string;
  pickupAvailable: boolean;
  deliveryDaysMin?: number;
  deliveryDaysMax?: number;
  price?: number;
};

export type OrderStatus = 'GENERATED' | 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface ITotalsOrder {
  items: string;
  insurance: string;
  taxes: string;
  grand: string;
}

export interface IQuoteOrder {
  uid: string;
  carrierCode: string;
  serviceCode: string;
  serviceName?: string;
  priceAmount: number;
  currency: string;
  logoUrl?: string;
  pickupAvailable?: boolean;
  trackingAvailable?: boolean;
  thermalPrintingAvailable?: boolean;
}

export interface IOrder {
  uid: string;
  orderNumber: number;
  trackingNumber?: string;
  originAddress: Address;
  destinationAddress: Address;
  trackingProvisional: string;
  status: OrderStatus;
  currency: 'MXN' | 'USD' | 'EUR';
  totals: ITotalsOrder;
  packagesCount?: number;
  productsCount?: number;
  quoteSelected: IQuoteOrder;
  packages?: Package[];
  createdAt: string;
  labelUrl?: string;
  carrier?: {
    name: string;
    service: string;
  };
  appLogo: string;
}

export type OrderResponse = IOrder


export interface OrdersTableProps {
  shipments: DataOrder[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (orderUid: string) => Promise<void>;
  onEdit?: (order: DataOrder) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export interface FilterModalProps {
  currentFilters: FilterValues;
  onChange: (newFilters: FilterValues) => void;
  onClose: (event?: any) => void;
}

export interface OrdersSearchBarProps {
  currentFilters: FilterValues;
  totalOrders: number;
  onFiltersChange: (newFilters: FilterValues) => void;
  onClearFilters?: () => void;
  onRefresh: () => void;
  onSearch: () => void;
}

export interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DeleteOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber?: string | number;
  isLoading?: boolean;
}

export interface NoOrdersStateProps {
  onConnectStore: () => void;
  onSyncOrders: () => void;
  onCreateManualOrder: () => void;
}

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

export const statusOptions = ['Pendiente', 'Generada'];
export const storeOptions = ['Todos', 'Shopify', 'Woocommerce', 'Tienda Nube', 'Postdog'];
export const integrationOptions = ['Todos', 'HDO', 'Doto', 'Devin', 'Sasa'];
export const dateRangeOptions = [
  'Todas',
  'Hoy',
  'Últimos 7 días',
  'Últimos 30 días',
  'Últimos 3 meses',
  'Personalizado'
];

// ==========================================
// (MOCK DATA)
// ==========================================
export const MOCK_ORDER_DATA: DataOrder[] = [
  {
    uid: '1',
    trackingProvisional: 'TRK-001-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1234,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Juan Pérez',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'María García',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Shopify'
  },
  {
    uid: '2',
    trackingProvisional: 'TRK-002-TEST',
    createdAt: '2024-05-21T12:00:00Z',
    status: 'GENERATED',
    orderNumber: 1235,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Ana Martínez',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Roberto Gómez',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Woocommerce'
  },
  {
    uid: '3',
    trackingProvisional: 'TRK-003-TEST',
    createdAt: '2024-05-22T09:00:00Z',
    status: 'PENDING',
    orderNumber: 1236,
    products: { quantity: 4 },
    originAddress: {
      fullName: 'Luis Hernández',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Sofía Rodríguez',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Tienda Nube'
  },
  {
    uid: '4',
    trackingProvisional: 'TRK-004-TEST',
    createdAt: '2024-05-23T14:00:00Z',
    status: 'GENERATED',
    orderNumber: 1237,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Carlos López',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Elena Sánchez',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Postdog'
  },
  {
    uid: '5',
    trackingProvisional: 'TRK-005-TEST',
    createdAt: '2024-05-24T12:00:00Z',
    status: 'PENDING',
    orderNumber: 1238,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Distribuidora MX',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Javier Torres',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Shopify'
  },
  {
    uid: '6',
    trackingProvisional: 'TRK-006-TEST',
    createdAt: '2024-05-25T12:00:00Z',
    status: 'GENERATED',
    orderNumber: 1239,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Almacén Central',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Isabel Ruiz',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Woocommerce'
  },
  {
    uid: '7',
    trackingProvisional: 'TRK-007-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1240,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Tienda Online',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Andrés Castro',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Tienda Nube'
  },
  {
    uid: '8',
    trackingProvisional: 'TRK-008-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1241,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Puntodog Admin',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Lucía Méndez',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Postdog'
  },
  {
    uid: '9',
    trackingProvisional: 'TRK-009-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1242,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Vendedor Pro',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Diego Ramos',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Shopify'
  },
  {
    uid: '10',
    trackingProvisional: 'TRK-010-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1243,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'E-commerce Center',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Patricia Luna',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Woocommerce'
  },
  {
    uid: '11',
    trackingProvisional: 'TRK-011-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1244,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Bodega Norte',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Gabriel Silva',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Tienda Nube'
  },
  {
    uid: '12',
    trackingProvisional: 'TRK-012-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1245,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Remitente Express',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Mónica Soto',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Postdog'
  },
  {
    uid: '13',
    trackingProvisional: 'TRK-013-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1246,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Shopify Master',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Fernando Cruz',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Shopify'
  },
  {
    uid: '14',
    trackingProvisional: 'TRK-014-TEST',
    createdAt: '2024-05-20T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1247,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Woocommerce King',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Silvia Navarro',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Woocommerce'
  },
  {
    uid: '15',
    trackingProvisional: 'TRK-015-DATE',
    createdAt: '2024-06-01T10:00:00Z',
    status: 'PENDING',
    orderNumber: 1248,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Cliente Fecha 1',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Destino Fecha 1',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 1,
      lengthCm: 20,
      widthCm: 20,
      heightCm: 20,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Shopify'
  },
  {
    uid: '16',
    trackingProvisional: 'TRK-016-DATE',
    createdAt: '2024-06-01T11:00:00Z',
    status: 'GENERATED',
    orderNumber: 1249,
    products: { quantity: 2 },
    originAddress: {
      fullName: 'Cliente Fecha 2',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Destino Fecha 2',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Woocommerce'
  },
  {
    uid: '17',
    trackingProvisional: 'TRK-017-DATE',
    createdAt: '2024-06-01T12:00:00Z',
    status: 'PENDING',
    orderNumber: 1250,
    products: { quantity: 3 },
    originAddress: {
      fullName: 'Cliente Fecha 3',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Destino Fecha 3',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 2.5,
      lengthCm: 30,
      widthCm: 20,
      heightCm: 15,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Tienda Nube'
  },
  {
    uid: '18',
    trackingProvisional: 'TRK-018-DATE',
    createdAt: '2024-06-01T13:00:00Z',
    status: 'PENDING',
    orderNumber: 1251,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Cliente Fecha 4',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Destino Fecha 4',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Postdog'
  },
  {
    uid: '19',
    trackingProvisional: 'TRK-019-DATE',
    createdAt: '2024-06-01T14:00:00Z',
    status: 'PENDING',
    orderNumber: 1252,
    products: { quantity: 5 },
    originAddress: {
      fullName: 'Cliente Fecha 5',
      postalCode: '01000',
      colony: 'San Ángel',
    },
    destinationAddress: {
      fullName: 'Destino Fecha 5',
      postalCode: '06700',
      colony: 'Roma Norte',
    },
    package: {
      packageType: 'Box',
      weightKg: 5,
      lengthCm: 40,
      widthCm: 40,
      heightCm: 40,
    },
    quoteCarrier: {
      carrierName: 'FedEx',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: true,
    },
    store: 'Shopify'
  },
  {
    uid: '20',
    trackingProvisional: 'TRK-020-DATE',
    createdAt: '2024-06-01T15:00:00Z',
    status: 'GENERATED',
    orderNumber: 1253,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Cliente Fecha 6',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Destino Fecha 6',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Woocommerce'
  },
  {
    uid: '20',
    trackingProvisional: 'TRK-020-DATE',
    createdAt: '2024-06-01T15:00:00Z',
    status: 'GENERATED',
    orderNumber: 1253,
    products: { quantity: 1 },
    originAddress: {
      fullName: 'Cliente Fecha 6',
      postalCode: '44100',
      colony: 'Centro',
    },
    destinationAddress: {
      fullName: 'Destino Fecha 6',
      postalCode: '64000',
      colony: 'Centro',
    },
    package: {
      packageType: 'Sobre',
      weightKg: 0.5,
      lengthCm: 25,
      widthCm: 18,
      heightCm: 2,
    },
    quoteCarrier: {
      carrierName: 'DHL',
      logoUrl: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
      pickupAvailable: false,
    },
    store: 'Woocommerce'
  },
];
