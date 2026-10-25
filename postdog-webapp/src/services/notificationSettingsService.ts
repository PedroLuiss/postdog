import { HttpService } from './apiClient';
import { NotificationSettings } from '../types';

export const NotificationSettingsService = {
  getSettings: async (): Promise<NotificationSettings> => {
    return HttpService.get<NotificationSettings>('/notifications/settings');
  },

  updateSettings: async (settings: FormData): Promise<{ message: string }> => {
    return HttpService.patchUpload<{ message: string }>('/notifications/settings', settings);
  },

  getMailPreview: async (templateName: string): Promise<string> => {
    return HttpService.get<string>(`/mail/preview/${templateName}`);
  }
};
