import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { HeaderData } from "../types/header.types";

export const headerApi = {
  get: () => apiClient.get<HeaderData>(API_ENDPOINTS.HEADER).catch(() => ({ data: {} as HeaderData })),
  update: (data: HeaderData) => apiClient.put<HeaderData>(API_ENDPOINTS.HEADER, data),
} as const;
