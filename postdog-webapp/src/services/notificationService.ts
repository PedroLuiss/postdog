import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../firebase';
import { HttpService } from './apiClient';
import { NotificationItem } from '../types';

export const notificationService = {
  async requestPermission(): Promise<string | null> {
    try {
      const vapidKey = process.env.REACT_APP_FIREBASE_VAPID_KEY;
      if (!vapidKey || !messaging) return null;

      if (!('Notification' in window)) {
        return null;
      }

      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: vapidKey
        });
        return token;
      }
      return null;
    } catch (error: any) {
      console.error('FCM ERROR CRÍTICO:', error);
      return null;
    }
  },

  async registerToken(token: string): Promise<void> {
    try {
      await HttpService.post('/notifications/device-token', { token });
    } catch (error) {
      console.error('FCM: Error enviando token al backend:', error);
    }
  },

  onMessageListener(callback: (payload: any) => void) {
    if (!messaging) {
      // console.warn('FCM: Messaging is not supported, skipping onMessage listener.');
      return () => {};
    }
    return onMessage(messaging, (payload) => {
      callback(payload);
    });
  },

  async getRecentNotifications(): Promise<NotificationItem[]> {
    try {
      const response = await this.getNotifications(1, 5, undefined, 'ALL', true);
      return response.items || [];
    } catch (error) {
      console.error('Error fetching recent notifications:', error);
      return [];
    }
  },

  async getNotifications(page = 1, limit = 5, search?: string, type?: string, prioritizeUnread?: boolean): Promise<any> {
    try {
      let url = `/notifications?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (type && type !== 'ALL') url += `&type=${type}`;
      if (prioritizeUnread) url += `&prioritize_unread=true`;

      const response = await HttpService.get(url);
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { items: [], meta: {} };
    }
  },

  async getUnreadCount(): Promise<number> {
    try {
      const response = await HttpService.get<{ count: number }>('/notifications/unread-count');
      return response.count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  },

  async markAsRead(uid: string): Promise<void> {
    try {
      await HttpService.patch(`/notifications/${uid}/read`, {});
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await HttpService.patch('/notifications/read-all', {});
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }
};
