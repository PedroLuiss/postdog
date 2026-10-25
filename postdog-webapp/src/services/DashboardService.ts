import { HttpService } from './apiClient';
import { DashboardMetrics, DashboardCharts, RecentShipment } from '../types/dashboard.type';

export const DashboardService = {
    getMetrics: async (): Promise<DashboardMetrics> => {
        return HttpService.get<DashboardMetrics>('dashboard/metrics');
    },

    getCharts: async (year: number): Promise<DashboardCharts> => {
        return HttpService.get<DashboardCharts>(`dashboard/charts?year=${year}`);
    },

    getRecentShipments: async (): Promise<RecentShipment[]> => {
        return HttpService.get<RecentShipment[]>('dashboard/recent-shipments');
    }
};
