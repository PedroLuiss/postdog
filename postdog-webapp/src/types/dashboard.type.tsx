import {
    FiMapPin,
    FiBox,
    FiBell,
    FiPackage,
    FiClock,
    FiTruck
} from 'react-icons/fi';

export const CalculatorIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-calculator-icon lucide-calculator"
    >
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <line x1="8" x2="16" y1="6" y2="6" />
        <line x1="16" x2="16" y1="14" y2="18" />
        <path d="M16 10h.01" />
        <path d="M12 10h.01" />
        <path d="M8 10h.01" />
        <path d="M12 14h.01" />
        <path d="M8 14h.01" />
        <path d="M12 18h.01" />
        <path d="M8 18h.01" />
    </svg>
);

export const OrdersIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-clipboard-list w-5 h-5 text-gray-600"
    >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <path d="M12 11h4" />
        <path d="M12 16h4" />
        <path d="M8 11h.01" />
        <path d="M8 16h.01" />
    </svg>
);

export const BillingIcon = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-receipt w-5 h-5 text-gray-600"
    >
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 17.5v-11" />
    </svg>
);

export interface SubmenuItem {
    label: string;
    path: string;
}

export interface SubmenuData {
    items: SubmenuItem[] | null;
    title: string | null;
}

export interface DashboardHeaderProps {
    userName: string;
}

export interface StatsCardProps {
    label: string;
    value: string | number;
    subtitle: string;
    icon: any;
}

export interface QuickActionItemProps {
    label: string;
    icon: any;
    onClick?: () => void;
}

export interface InfoTooltipProps {
    title: string;
    placement?: any;
    classNameInfoIcon?: string;
}

export interface StatsOverviewProps {
    statsCards: StatsCardData[];
}


export interface QuickActionsProps {
    quickActions: { label: string; icon: any }[];
    onAction: (action: string) => void;
}


export interface RecentShipmentsProps {
    onAction: (action: string) => void;
}


export interface ExtraChargesProps {
    balance: string;
    isLoadingMetrics?: boolean;
}

export interface DashboardState {
    userName: string;
    stats: {
        monthlyShipments: string;
        pendingOrders: string;
        inTransit: string;
    };
    statsCards: StatsCardData[];
    quickActions: { label: string; icon: any }[];

    extraChargesBalance: string;
    handleViewHistory: () => void;
    handleQuickAction: (action: string) => void;
}

export interface StatsCardData {
    label: string;
    value: string | number;
    subtitle: string;
    icon: any;
}

export const INITIAL_STATS = {
    monthlyShipments: "0",
    pendingOrders: "0",
    inTransit: "0",
};

export const getStatsCards = (stats: typeof INITIAL_STATS): StatsCardData[] => [
    { label: 'dashboard.stats.shipments', value: stats.monthlyShipments, subtitle: 'Envíos realizados este mes', icon: FiPackage },
    { label: 'dashboard.stats.pending', value: stats.pendingOrders, subtitle: 'Órdenes por procesar', icon: FiClock },
    { label: 'dashboard.stats.transit', value: stats.inTransit, subtitle: 'Paquetes en camino', icon: FiTruck },
];

export const QUICK_ACTIONS = [
    { label: 'Cotizador', icon: CalculatorIcon as any },
    { label: 'Órdenes', icon: OrdersIcon as any },
    { label: 'Facturación', icon: BillingIcon as any },
    { label: 'Direcciones', icon: FiMapPin },
    { label: 'Paquetes', icon: FiBox },
    { label: 'Notificaciones', icon: FiBell },
];

export const EXTRA_CHARGES_BALANCE = "0.00";


export interface DashboardMetrics {
    totalShipments: number;
    monthlyShipments: number;
    totalTopUps: number;
    monthlyTopUps: number;
    pendingExtraCharges: number;
}

export interface AnnualActivity {
    month: string;
    count: number;
}

export interface TopCarrier {
    carrier: string;
    count: number;
}

export interface TopDestination {
    state: string;
    count: number;
}

export interface DashboardCharts {
    annualActivity: AnnualActivity[];
    annualActivityMeta: { max: number; step: number };
    topCarriers: TopCarrier[];
    topCarriersMeta: { max: number; step: number };
    topDestinations: TopDestination[];
    topDestinationsMeta: { max: number; step: number };
}

export interface RecentShipment {
    uid: string;
    carrierName: string;
    carrierLogo: string;
    trackingNumber: string;
    recipientName: string;
    status: string;
    createdAt: string;
}
