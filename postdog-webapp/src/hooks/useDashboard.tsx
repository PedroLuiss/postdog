import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useDashboardMetrics } from './useDashboardMetrics';
import { QUICK_ACTIONS } from '../types/dashboard.type';
import { getStatsCards } from '../components/DashboardPageComponents/StatsOverview/utils';


export const useDashboard = () => {
    const appContext = useAppContext();
    const userName = appContext?.user?.user?.first_name || "Usuario";
    const navigate = useNavigate();
    
    const { metrics, isLoading: isLoadingMetrics } = useDashboardMetrics();

    const statsCards = getStatsCards(metrics);
    const quickActions = QUICK_ACTIONS;
    const extraChargesBalance = metrics?.pendingExtraCharges ? 
        metrics.pendingExtraCharges.toLocaleString('en-US', { minimumFractionDigits: 2 }) : 
        "0.00";

    const handleViewHistory = () => {
        navigate('/shipping/orders');
    };

    const handleQuickAction = (action: string) => {
        switch (action) {
            case 'Cotizador':
                navigate('/shipping/quote');
                break;
            case 'Órdenes':
                navigate('/shipping/orders');
                break;
            case 'Facturación':
                navigate('/finance/billing');
                break;
            case 'Direcciones':
                navigate('/shipping/Directions');
                break;
            case 'Paquetes':
                navigate('/settings/packages');
                break;
            case 'Notificaciones':
                navigate('/settings/notifications');
                break;
            case 'Ver historial':
                navigate('/shipping/history');
                break;

            default:
                console.log(`Action ${action} not implemented`);
        }
    };

    return {
        userName,
        metrics,
        isLoadingMetrics,
        statsCards,
        quickActions,
        extraChargesBalance,
        handleViewHistory,
        handleQuickAction,
    };
};

