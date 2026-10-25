export interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  data: T[];
  meta: MetaData;
}

export interface ApiResponseItems<T> {
  items: T[];
  meta: MetaData;
}


export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  method: string;
  path: string;
  timestamp: string; 
}
