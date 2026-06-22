import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { SectionRecord, CreateSectionRequest, UpdateSectionRequest } from "shared-api";

export type { SectionRecord, CreateSectionRequest, UpdateSectionRequest };

interface CmsListResponse {
  data: { sections: SectionRecord[] };
}

interface CmsDetailResponse {
  data: { section: SectionRecord };
}

interface CmsCreateResponse {
  data: { sectionId: number };
}

interface CmsStatusResponse {
  data: { status: string };
}

export const sectionApi = {
  getList: (filters?: { name?: string; status?: string }) =>
    apiClient.post<CmsListResponse>(API_ENDPOINTS.GET_LIST_SECTION, filters ?? {}),

  getById: (id: number) =>
    apiClient.post<CmsDetailResponse>(API_ENDPOINTS.GET_SECTION, { id }),

  create: (payload: CreateSectionRequest) =>
    apiClient.post<CmsCreateResponse>(API_ENDPOINTS.CREATE_SECTION, payload),

  update: (payload: UpdateSectionRequest) =>
    apiClient.post<CmsStatusResponse>(API_ENDPOINTS.UPDATE_SECTION, payload),

  remove: (id: number) =>
    apiClient.post<CmsStatusResponse>(API_ENDPOINTS.REMOVE_SECTION, { id }),
} as const;
