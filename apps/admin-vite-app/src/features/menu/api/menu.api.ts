import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { NavMenuItem } from "../types/menu.types";

export const menuApi = {
  get: () => apiClient.get<NavMenuItem[]>(API_ENDPOINTS.MENU).catch(() => ({ data: [] as NavMenuItem[] })),
  update: (data: NavMenuItem[]) => apiClient.put<NavMenuItem[]>(API_ENDPOINTS.MENU, data),
} as const;
