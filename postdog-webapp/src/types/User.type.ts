
export interface AdminCreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  password?: string;
  accepted_terms: boolean;
  role_id: string;
}

export interface UserDocument {
  uid: string;
  fileName: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  role_id: string;
}


export interface AdminUserResponse {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  accepted_terms: boolean;
  status?: {
    id: number;
    uid: string;
    name: string;
    description: string;
  };
  email_verified: boolean;
  phone_verified: boolean;
  reset_password_token_expiration: string | null;
  profile_image_url: string | null;
  role_id: string | null;
  plan: string | null;
  monthlyShipmentCount: number;
  isVerified: boolean;
  curp: string | null;
  ine: string | null;
  lastActivity: string | null;
  planExpirationDate: string | null;
  lastShipmentDate: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  documents?: UserDocument[];
}

export interface UserUI extends AdminUserResponse {
    firstName: string;
    lastName: string;
    phone: string;
    createdAt: string;
    isActive: boolean;
    role: string;
    plan: string;
    lastShipment: string | null;
    documents: UserDocument[];
}

export interface UserStats {
  chihuahua: number;
  pug: number;
  husky: number;
  pitbull: number;
}

export interface UserMovement {
  uid: string;
  type: 'CREDIT' | 'DEBIT';
  amount: string;
  referenceType: string;
  referenceId: string;
  createdAt: string;
  invoiceId: string | null;
}

export interface UserSummary {
  email: string;
  balance: string;
  totalRecharges: number;
  totalCharges: number;
  shipmentCount: number;
  movements: UserMovement[];
  isVerified: boolean;
}

export interface BulkActionResponse {
  success: boolean;
  processed: number;
  successCount: number;
  skippedCount: number;
  skipped: any[];
}

export interface UserFiscalData {
  uid: string;
  personType: 'PHYSICAL' | 'MORAL';
  rfc: string;
  businessName: string;
  taxRegime: string;
  paymentMethod: string;
  cfdiUse: string;
  postalCode: string;
  autoInvoiceEnabled: boolean;
  autoInvoiceType: string;
  createdAt: string;
  updatedAt: string;
}
