import { HttpService } from './apiClient';
import { GlobalAlertCreateRequest, GlobalAlertResponse, PaginatedGlobalAlertResponse } from '../types/globalAlerts.type';

export const GlobalAlertsService = {
  getAll: (page: number = 1, limit: number = 10) => 
    HttpService.get<PaginatedGlobalAlertResponse>(`/admin/alerts?page=${page}&limit=${limit}`),
  
  create: (data: GlobalAlertCreateRequest) => 
    HttpService.post<GlobalAlertResponse, GlobalAlertCreateRequest>('/admin/alerts', data),
  
  update: (uid: string, data: GlobalAlertCreateRequest) => 
    HttpService.put<GlobalAlertResponse, GlobalAlertCreateRequest>(`/admin/alerts/${uid}`, data),
  
  delete: (uid: string) => 
    HttpService.delete<{ success: boolean }>(`/admin/alerts/${uid}`),
    
  togglePin: (uid: string, isPinned: boolean) => 
    HttpService.patch<GlobalAlertResponse, { isPinned: boolean }>(`/global-alerts/${uid}/pin`, { isPinned }),
};
