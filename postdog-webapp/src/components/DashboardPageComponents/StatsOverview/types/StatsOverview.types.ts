import { StatsCardData } from "../../../../types";

export interface StatsOverviewProps {
    statsCards: StatsCardData[];
    isLoadingMetrics: boolean;
}