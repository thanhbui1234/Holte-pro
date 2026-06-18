import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { ContactCtaData, ContactSubmission, ContactStatus } from "../types/contact.types";

export const contactApi = {
  getCta: () => apiClient.get<ContactCtaData>(API_ENDPOINTS.CONTACT_CTA).catch(() => ({ data: {} as ContactCtaData })),
  updateCta: (data: ContactCtaData) => apiClient.put<ContactCtaData>(API_ENDPOINTS.CONTACT_CTA, data),
  
  getSubmissions: () => apiClient.get<ContactSubmission[]>(API_ENDPOINTS.CONTACT_SUBMISSIONS).catch(() => ({ data: [] as ContactSubmission[] })),
  updateStatus: (id: string, status: ContactStatus) => apiClient.patch<ContactSubmission>(`${API_ENDPOINTS.CONTACT_SUBMISSIONS}/${id}`, { status }),
  removeSubmission: (id: string) => apiClient.delete(`${API_ENDPOINTS.CONTACT_SUBMISSIONS}/${id}`),
} as const;
