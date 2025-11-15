import { environment } from "@/config/environment";
import { buildHeadersWithCsrf } from "@/utils/csrf";
import { authenticatedFetch } from "./http-interceptor";

const BASE_URL = `${environment.apiUrl}/api/admin/settings`;

export interface StoreSettingsDto {
  storeName: string;
  storeEmail: string;
  storePhone: string | null;
  supportEmail: string | null;
  currency: string;
  language: string;
  timezone: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  lowStockAlert: boolean;
  lowStockThreshold: number;
  maintenanceMode: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
}

export type StoreSettingsPayload = StoreSettingsDto;

async function handleResponse(response: Response): Promise<StoreSettingsDto> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Falha ao comunicar com o servidor");
  }
  return (await response.json()) as StoreSettingsDto;
}

export const adminSettingsService = {
  async getSettings(): Promise<StoreSettingsDto> {
    const response = await authenticatedFetch(BASE_URL, {
      method: "GET",
    });
    return handleResponse(response);
  },

  async updateSettings(
    payload: StoreSettingsPayload
  ): Promise<StoreSettingsDto> {
    const response = await authenticatedFetch(BASE_URL, {
      method: "PUT",
      headers: await buildHeadersWithCsrf(),
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },
};
