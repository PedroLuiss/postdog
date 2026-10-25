export type GlobalAlertPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Alert {
  uid: string;
  title: string;
  message: string;
  icon: string;
  sendAt: string;
  priority: GlobalAlertPriority;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface GlobalAlertCreateRequest {
  title: string;
  message: string;
  icon: string;
  sendAt?: string;
  priority: GlobalAlertPriority;
  isPinned: boolean;
}

export interface GlobalAlertResponse {
  uid: string;
  title: string;
  message: string;
  icon: string;
  sendAt: string;
  priority: GlobalAlertPriority;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PaginatedGlobalAlertResponse {
  items: GlobalAlertResponse[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}