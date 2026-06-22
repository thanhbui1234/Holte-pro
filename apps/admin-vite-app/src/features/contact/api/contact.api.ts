import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { ContactCtaData, SupportFormRecord, ContactStatus } from "../types/contact.types";

export const contactApi = {
  getCta: () => apiClient.get<ContactCtaData>(API_ENDPOINTS.CONTACT_CTA).catch(() => ({ data: {} as ContactCtaData })),
  updateCta: (data: ContactCtaData) => apiClient.put<ContactCtaData>(API_ENDPOINTS.CONTACT_CTA, data),
  
  getSubmissions: (filters?: { phone?: string; status?: ContactStatus; supporter?: string }) => 
    apiClient.post<{ data: { supportForms: SupportFormRecord[] } }>(API_ENDPOINTS.GET_LIST_SUPPORT_FORM, filters ?? {}),
  
  updateStatus: (id: string | number, status: ContactStatus, supporter?: string) => 
    apiClient.post(API_ENDPOINTS.UPDATE_SUPPORT_FORM_STATUS, { id, status, supporter }),
    
  removeSubmission: (id: string | number) => 
    apiClient.delete(API_ENDPOINTS.REMOVE_SUPPORT_FORM, { data: { id } }),
} as const;
