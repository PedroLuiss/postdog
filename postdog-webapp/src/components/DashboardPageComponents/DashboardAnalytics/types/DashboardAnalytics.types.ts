export interface ActivityData {
    day: number;
    envios: number;
    recargas: number;
}

export interface CarrierData {
    name: string;
    envios: number;
    color: string;
}

export interface DestinationData {
    city: string;
    envios: number;
    color: string;
}

export interface DashboardAnalyticsProps {
    activityData: ActivityData[];
    carrierData: CarrierData[];
    destinationData: DestinationData[];
}