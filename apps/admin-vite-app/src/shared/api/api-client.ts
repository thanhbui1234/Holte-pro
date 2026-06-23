import { createApiClient, createStorageAdapter } from "shared-api";
import { triggerNextJsRevalidate } from "./revalidate";

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  tokenAdapter: createStorageAdapter(),
  onRefreshFailed: () => {
    window.location.href = "/login";
  },
});

// Add a global interceptor to catch all mutating requests and automatically trigger revalidation
apiClient.interceptors.response.use((response) => {
  const method = response.config.method?.toUpperCase();
  const url = response.config.url || "";
  
  // Detect if this was a mutating request
  const isModifyingMethod = ["PUT", "PATCH", "DELETE"].includes(method || "");
  const isModifyingPost = method === "POST" && (
    url.includes("create-") || 
    url.includes("update-") || 
    url.includes("remove-") || 
    url.includes("upload-")
  );

  // Revalidate the entire Next.js site cache if anything was modified successfully
  if (isModifyingMethod || isModifyingPost) {
     triggerNextJsRevalidate();
  }
  
  return response;
}, (error) => {
  return Promise.reject(error);
});
