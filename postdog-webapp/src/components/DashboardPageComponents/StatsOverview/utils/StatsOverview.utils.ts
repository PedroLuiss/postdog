import { DashboardMetrics, StatsCardData } from "../../../../types";
import { FiPackage, FiTrendingUp } from "react-icons/fi";

export const getStatsCards = (metrics: DashboardMetrics | null): StatsCardData[] => {
    const currentMonth = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date());
    const monthCapitalized = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

    return [
        { 
            label: 'Envíos totales', 
            value: metrics?.totalShipments ?? 0, 
            subtitle: 'Histórico de todos tus envíos', 
            icon: FiPackage 
        },
        { 
            label: 'Recargas totales', 
            value: `$${(metrics?.totalTopUps ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
            subtitle: 'Histórico de todas tus recargas', 
            icon: FiTrendingUp 
        },
        { 
            label: 'Envíos mensuales', 
            value: metrics?.monthlyShipments ?? 0, 
            subtitle: `Envíos en ${monthCapitalized}`, 
            icon: FiPackage 
        },
        { 
            label: 'Recargas del mes', 
            value: `$${(metrics?.monthlyTopUps ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
            subtitle: `Recargas en ${monthCapitalized}`, 
            icon: FiTrendingUp 
        },
    ];
};