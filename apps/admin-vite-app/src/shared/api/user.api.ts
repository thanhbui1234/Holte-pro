import { apiClient, API_ENDPOINTS } from "@/shared/api";

interface CmsApiResponse<T> {
  cmdId: string;
  cmdTime: number;
  data: T;
  error?: { errorMsg: string; errorCode: number };
}

interface CreateUserRequest {
  email: string;
}

interface CreateUserResponse {
  email: string;
  id: number;
}

export const userApi = {
  create: (data: CreateUserRequest) =>
    apiClient.post<CmsApiResponse<CreateUserResponse>>(
      API_ENDPOINTS.CREATE_USER,
      data,
    ),
} as const;
