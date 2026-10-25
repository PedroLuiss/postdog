import { HttpService } from './apiClient';

export interface PricingRule {
  id?: number; // Optional for new rules in bulk
  carrierCode: string;
  serviceCode: string;
  plan: string;
  minMargin: number;
  maxMargin?: number | null;
  percentage: number;
}

export interface PricingRuleBulkPayload {
  id?: number;
  carrierCode?: string; // Mapped dynamically if missing
  serviceCode?: string; // Mapped dynamically if missing
  plan?: string;        // Mapped dynamically if missing
  minMargin: number;
  maxMargin?: number | null;
  percentage: number;
}

export interface BulkRulesRequest {
  rules: PricingRuleBulkPayload[];
}

export interface NestedServiceCatalogItem {
  serviceCode: string;
  serviceName: string;
}

export interface NestedCarrierCatalogItem {
  carrierCode: string;
  carrierName: string;
  services: NestedServiceCatalogItem[];
}

// Backend Integration
export const PricingRulesService = {
  // GET Catalogs
  async getCatalogs(): Promise<NestedCarrierCatalogItem[]> {
    const res = await HttpService.get<{ statusCode: number; data: NestedCarrierCatalogItem[] }>('/pricing-rules/catalogs');
    return res.data;
  },

  // GET /pricing-rules
  async getRules(): Promise<PricingRule[]> {
    const res = await HttpService.get<PricingRule[]>('/pricing-rules');
    return res;
  },

  // POST /pricing-rules/bulk
  async bulkUpdateRules(payload: BulkRulesRequest): Promise<{ statusCode: number; message: string }> {
    const res = await HttpService.post<{ statusCode: number; message: string }, BulkRulesRequest>('/pricing-rules/bulk', payload);
    return res;
  },

  // DELETE /pricing-rules/:id
  async deleteRule(id: number): Promise<{ statusCode: number; message: string }> {
    const res = await HttpService.delete<{ statusCode: number; message: string }>(`/pricing-rules/${id}`);
    return res;
  }
};
