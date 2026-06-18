import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { FooterData } from "../types/footer.types";

export const footerApi = {
  get: () => apiClient.get<FooterData>(API_ENDPOINTS.FOOTER).catch(() => ({ data: {} as FooterData })),
  update: (data: FooterData) => apiClient.put<FooterData>(API_ENDPOINTS.FOOTER, data),
} as const;
