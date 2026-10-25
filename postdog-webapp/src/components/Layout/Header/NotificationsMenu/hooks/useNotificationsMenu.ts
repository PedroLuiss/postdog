import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealTimeNotificationsContext } from '../../../../../context/RealTimeNotificationContext';

export const useNotificationsMenu = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    unreadCount,
    loading,
    isFetchingMore,
    hasMore,
    loadMore
  } = useRealTimeNotificationsContext();

  const handleViewAll = () => navigate('/notifications');

  const handleMarkAsRead = (uid: string) => {
    markAsRead(uid);
  };

  return {
    recentNotifications: notifications,
    unreadCount,
    markAllAsRead,
    handleMarkAsRead,
    handleViewAll,
    loading,
    isFetchingMore,
    hasMore,
    loadMore
  };
};