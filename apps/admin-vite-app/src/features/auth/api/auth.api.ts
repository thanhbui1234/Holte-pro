import { apiClient, API_ENDPOINTS } from "@/shared/api";
import type { AxiosResponse } from "axios";

interface LoginGoogleAuthRequest {
  code: string;
  redirectUrl: string;
}

interface LoginGoogleAuthResponse {
  accessToken: string;
  ttl: number;
  user: {
    id: number;
    email: string;
    googleSub: string;
    emailVerified: boolean;
    displayName: string;
    givenName: string;
    familyName: string;
    avatarUrl: string;
    lastLoginAt: number;
  };
}

interface LogoutRequest {
  revokeToken: string;
}

interface CmsApiResponse<T> {
  cmdId: string;
  cmdTime: number;
  triggerId: string;
  method: string;
  path: string;
  data: T;
  error?: { errorMsg: string; errorCode: number };
}

export const authApi = {
  loginWithGoogle: (params: LoginGoogleAuthRequest) =>
    apiClient.post<CmsApiResponse<LoginGoogleAuthResponse>>(
      API_ENDPOINTS.LOGIN_GOOGLE_AUTH,
      params,
    ),

  logout: (revokeToken: string) =>
    apiClient.post<CmsApiResponse<{ revokeToken: string; result: boolean }>>(
      API_ENDPOINTS.LOGOUT,
      { revokeToken } satisfies LogoutRequest,
    ),
} as const;
