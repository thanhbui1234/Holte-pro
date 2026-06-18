import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { AboutData } from "../types/about.types";

export const aboutApi = {
  get: () => apiClient.get<AboutData>(API_ENDPOINTS.ABOUT).catch(() => ({ data: {} as AboutData })),
  update: (data: AboutData) => apiClient.put<AboutData>(API_ENDPOINTS.ABOUT, data),
} as const;
