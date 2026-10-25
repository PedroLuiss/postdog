export interface UserProfile {
  uid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_country_code: string;
  phone_number: string;
  accepted_terms: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  reset_password_token_expiration: string | null;
  profile_image_url: string | null;
  role_id: string;
  role?: string; 
  plan: string;
  monthlyShipmentCount: number;
  isVerified: boolean;
  curp: string | null;
  ine: string | null;
  lastActivity: string;
  planExpirationDate: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserState extends Partial<UserProfile> {
  access_token?: string;
  user?: UserProfile;
}