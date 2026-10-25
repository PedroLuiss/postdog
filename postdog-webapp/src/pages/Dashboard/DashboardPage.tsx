import React from 'react';

//Components
import DashboardHeader from "../../components/DashboardPageComponents/DashboardHeader/DashboardHeader";
import StatsOverview from "../../components/DashboardPageComponents/StatsOverview/StatsOverview";
import QuickActions from "../../components/DashboardPageComponents/QuickActions/QuickActions";
import DashboardPageShipments from "../../components/DashboardPageComponents/DashboardPageShipments/DashboardPageShipments";
import ExtraCharges from "../../components/DashboardPageComponents/ExtraCharges/ExtraCharges";
import { DashboardAnalytics } from '../../components/DashboardPageComponents/DashboardAnalytics/DashboardAnalytics';

//Hooks
import { useDashboard } from "../../hooks/useDashboard";

//Styles
import styles from "./DashboardPage.module.scss";

export const DashboardPage = () => {
  const {
    userName,
    statsCards,
    quickActions,
    extraChargesBalance,
    handleQuickAction,
    isLoadingMetrics
  } = useDashboard();

  return (
    <div className={styles.mainPage}>
      <div className={styles.dashboard}>
        <DashboardHeader userName={userName} />
        <StatsOverview statsCards={statsCards} isLoadingMetrics={isLoadingMetrics} />
        <DashboardAnalytics />
        <QuickActions quickActions={quickActions} onAction={handleQuickAction} />
        <DashboardPageShipments onAction={handleQuickAction} />
        <ExtraCharges balance={extraChargesBalance} isLoadingMetrics={isLoadingMetrics} />
      </div>
    </div>
  );
};