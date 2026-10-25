export interface NotificationSettings {
  uid?: string;
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  enabledCreated: boolean;
  enabledShipped: boolean;
  enabledDelivered: boolean;
  enabledCanceled: boolean;
  storeUrl?: string;
  supportPhone?: string;
  supportEmail?: string;
  buttonTextColor?: string;
}
