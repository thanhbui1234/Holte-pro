import { apiClient, API_ENDPOINTS } from "@/shared/api";

interface CmsApiResponse<T> {
  cmdId: string;
  cmdTime: number;
  data: T;
  error?: { errorMsg: string; errorCode: number };
}

export interface SectionRecord {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE" | string;
  data: Record<string, any>;
  createdTime: number;
  updatedTime: number;
}

export interface CreateSectionRequest {
  name: string;
  description?: string;
  displayOrder?: number;
  status?: string;
  data?: Record<string, any>;
}

export interface UpdateSectionRequest {
  id: number;
  name: string;
  description?: string;
  displayOrder?: number;
  status?: string;
  data?: Record<string, any>;
}

export const sectionApi = {
  /** Get list of sections */
  getList: (filters?: { name?: string; status?: string }) =>
    apiClient.post<CmsApiResponse<{ sections: SectionRecord[] }>>(
      API_ENDPOINTS.GET_LIST_SECTION,
      filters || {}
    ),

  /** Get section detail by ID */
  getById: (id: number) =>
    apiClient.post<CmsApiResponse<{ section: SectionRecord }>>(
      API_ENDPOINTS.GET_SECTION,
      { id }
    ),

  /** Create new section */
  create: (data: CreateSectionRequest) =>
    apiClient.post<CmsApiResponse<{ sectionId: number }>>(
      API_ENDPOINTS.CREATE_SECTION,
      data
    ),

  /** Update section */
  update: (data: UpdateSectionRequest) =>
    apiClient.post<CmsApiResponse<{ status: string }>>(
      API_ENDPOINTS.UPDATE_SECTION,
      data
    ),

  /** Remove section */
  remove: (id: number) =>
    apiClient.delete<CmsApiResponse<{ status: string }>>(
      API_ENDPOINTS.REMOVE_SECTION,
      { data: { id } }
    ),
} as const;
