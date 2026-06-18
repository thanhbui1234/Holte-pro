import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { CustomSection } from "shared-ui";

export const customSectionsApi = {
  getList: () => apiClient.get<CustomSection[]>(API_ENDPOINTS.CUSTOM_SECTIONS).catch(() => ({ data: [] as CustomSection[] })),
  update: (data: CustomSection[]) => apiClient.put<CustomSection[]>(API_ENDPOINTS.CUSTOM_SECTIONS, data),
} as const;
