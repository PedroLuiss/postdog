import React from 'react';
import DashboardLayout from '../../layouts/Dashboard/DashboardLayout';
import { NotificationsList } from '../../components/Notifications/NotificationsList/NotificationsList';

export const NotificationsPage = () => {
  return (
    <DashboardLayout title="Notificaciones">
      <NotificationsList />
    </DashboardLayout>
  );
};

export default NotificationsPage;
