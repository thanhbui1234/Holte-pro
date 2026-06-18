import { createApiClient, createStorageAdapter } from "shared-api";

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  tokenAdapter: createStorageAdapter(),
  onRefreshFailed: () => {
    window.location.href = "/login";
  },
});
