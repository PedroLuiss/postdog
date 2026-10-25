import { AdminCreateUserData, UserStats, AdminUserResponse, UserCreateInput, UserSummary, BulkActionResponse, UserFiscalData } from '../types';
import { HttpService } from './apiClient';
import { mapAdminUsersToUI } from '../utils/mappers/user.mapper';

export const AdminUserService = {
  getStats: async (): Promise<UserStats> => {
    try {
      const response = await HttpService.get<{ plan: string, count: string }[]>('admin/users/stats');
      const stats: UserStats = {
        chihuahua: 0,
        pug: 0,
        husky: 0,
        pitbull: 0
      };
      
      response.forEach(item => {
        const planKey = item.plan.toLowerCase() as keyof UserStats;
        if (Object.prototype.hasOwnProperty.call(stats, planKey)) {
          stats[planKey] = parseInt(item.count, 10);
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return { chihuahua: 0, pug: 0, husky: 0, pitbull: 0 };
    }
  },

  getAll: async (page = 1, limit = 50, filters: any = {}) => {
    const offset = (page - 1) * limit;
    const params: any = {
      limit,
      offset,
      sortBy: filters.sortBy || 'created_at',
      sortOrder: filters.sortOrder || 'DESC'
    };

    if (filters.search) params.search = filters.search;
    
    if (filters.verification && filters.verification !== 'all') {
      params.isVerified = filters.verification === 'verified';
    }

    if (filters.plan && filters.plan !== 'all') {
      params.plan = filters.plan.toUpperCase();
    }

    if (filters.role && filters.role !== 'all') {
      params.role = filters.role.toUpperCase();
    }

    if (filters.status && filters.status !== 'all') {
      params.status = filters.status.toUpperCase();
    }

    if (filters.dateType && filters.dateType !== 'all') {
        let prefix = 'registrationDate';
        if (filters.dateType === 'last_shipment') prefix = 'lastShipmentDate';
        if (filters.dateType === 'last_activity') prefix = 'lastActivity';
        
        if (filters.startDate) {
            try {
                params[`${prefix}Start`] = new Date(filters.startDate).toISOString().split('T')[0];
            } catch (e) {
                console.error('Invalid startDate', filters.startDate);
            }
        }
        
        if (filters.endDate) {
            try {
                params[`${prefix}End`] = new Date(filters.endDate).toISOString().split('T')[0];
            } catch (e) {
                console.error('Invalid endDate', filters.endDate);
            }
        }
    }

    const query = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const response = await HttpService.get<{ items: AdminUserResponse[], total: number, limit: number, offset: number }>(`admin/users?${query}`);

    return {
      items: mapAdminUsersToUI(response.items),
      meta: {
        totalItems: response.total,
        itemCount: response.items.length,
        itemsPerPage: response.limit,
        totalPages: Math.ceil(response.total / response.limit),
        currentPage: page
      }
    };
  },

  create: async (data: UserCreateInput) => {
    const payload: AdminCreateUserData = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_country_code: '+52', 
      phone_number: data.phone,
      password: data.password,
      accepted_terms: true,
      role_id: data.role_id || 'USER'
    };

    return await HttpService.post<AdminUserResponse, AdminCreateUserData>('admin/users', payload);
  },

  update: async (uid: string, data: any) => {
    console.log('AdminUserService: Updating user', uid, data);
    const formData = new FormData();
    
    if (data.phone) formData.append('phone_number', data.phone);
    if (data.curp) formData.append('curp', data.curp);
    if (data.ine) formData.append('ine', data.ine);
    formData.append('email', data.email);
    formData.append('first_name', data.firstName);
    formData.append('last_name', data.lastName);
    
    formData.append('phone_country_code', '+52');
    
    if (data.verificationFiles && data.verificationFiles.length > 0) {
        data.verificationFiles.forEach((fileObj: any) => {
            if (fileObj.file) {
                formData.append('documents', fileObj.file);
            }
        });
    }


    return await HttpService.patchUpload<AdminUserResponse>(`admin/users/${uid}`, formData);
  },

  delete: async (uid: string) => {
    return await HttpService.delete<{ generatedMaps: any[], raw: any[], affected: number }>(`admin/users/${uid}`);
  },

  activate: async (uid: string) => {
    return await HttpService.post<{ success: boolean }, {}>(`admin/users/${uid}/activate`, {});
  },

  deactivate: async (uid: string) => {
    return await HttpService.post<{ success: boolean }, {}>(`admin/users/${uid}/deactivate`, {});
  },

  resetPassword: async (uid: string) => {
    return await HttpService.post<{ message: string }, {}>(`admin/users/${uid}/reset-password`, {});
  },

  notify: async (uid: string, data: { title: string, message: string, icon: string }) => {
    return await HttpService.post<{ success: boolean }, { title: string, message: string, icon: string }>(`admin/users/${uid}/notify`, data);
  },

  bulkAction: async (action: string, userIds: string[], payload?: any): Promise<BulkActionResponse> => {
    return await HttpService.post<BulkActionResponse, any>('admin/users/bulk-actions', {
      userIds,
      action,
      payload
    });
  },

  getUserSummary: async (uid: string): Promise<UserSummary> => {
    return await HttpService.get<UserSummary>(`admin/users/${uid}/summary`);
  },

  getUserFiscalData: async (uid: string): Promise<UserFiscalData> => {
    return await HttpService.get<UserFiscalData>(`admin/users/${uid}/fiscal-data`);
  }
};
