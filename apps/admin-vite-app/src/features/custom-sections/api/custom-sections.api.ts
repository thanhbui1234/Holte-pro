import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { CustomSection } from "shared-ui";

export const customSectionsApi = {
  getList: () => apiClient.get<CustomSection[]>(API_ENDPOINTS.GET_LIST_SECTION).catch(() => ({ data: [] as CustomSection[] })),
  create: (name: string) => apiClient.post<CustomSection>(API_ENDPOINTS.CREATE_SECTION, { name, type: "CUSTOM", displayOrder: Math.floor(Date.now() / 1000), data: {} }),
  update: (data: CustomSection[]) => apiClient.put<CustomSection[]>(API_ENDPOINTS.CUSTOM_SECTIONS, data),
} as const;
