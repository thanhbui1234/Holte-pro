import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { LayoutSection } from "../types/layout.types";

export const layoutApi = {
  get: () => apiClient.get<LayoutSection[]>(API_ENDPOINTS.LAYOUT).catch(() => ({ data: [] as LayoutSection[] })),
  update: (data: LayoutSection[]) => apiClient.put<LayoutSection[]>(API_ENDPOINTS.LAYOUT, data),
} as const;
