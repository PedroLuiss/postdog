export interface NotificationItem {
    uid: string;
    userId: number;
    title: string;
    body: string;
    type: NotificationType;
    data?: {icon: string, type: string};
    readAt: string | null;
    createdAt: string;
    isGlobal?: boolean;
    isPinned?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    icon?: string;
}

export type NotificationType = 'SYSTEM' | 'BILLING' | 'PLAN' | 'SHIPMENT';

export interface RealTimeNotificationContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    loading: boolean;
    isFetchingMore: boolean;
    hasMore: boolean;
    search: string;
    filterType: string;
    setSearch: (search: string) => void;
    setFilterType: (type: string) => void;
    fetchNotifications: (page?: number, append?: boolean) => Promise<void>;
    loadMore: () => void;
    markAsRead: (uid: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

export interface AllNotificationsResponse {
  data: NotificationItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}