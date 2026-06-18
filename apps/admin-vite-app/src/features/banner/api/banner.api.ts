import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { BannerData } from "../types/banner.types";

export const bannerApi = {
  get: () => apiClient.get<BannerData>(API_ENDPOINTS.BANNER).catch(() => ({ data: {} as BannerData })),
  update: (data: BannerData) => apiClient.put<BannerData>(API_ENDPOINTS.BANNER, data),
} as const;
