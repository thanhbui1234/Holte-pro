import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/api-client";
import { API_ENDPOINTS } from "@/shared/api/api-endpoints";
import type { WebPreviewImageData } from "../types/web-preview-image.types";

const QUERY_KEY = ["web-preview-image"] as const;

export function useWebPreviewImage() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.post(API_ENDPOINTS.GET_WEB_PREVIEW_IMAGE_URL, {});
      return res.data?.data as WebPreviewImageData;
    },
  });
}

export function useUpsertWebPreviewImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { imageUrl: string }) => {
      const res = await apiClient.post(API_ENDPOINTS.UPSERT_WEB_PREVIEW_IMAGE_URL, data);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}

export function useRemoveWebPreviewImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(API_ENDPOINTS.REMOVE_WEB_PREVIEW_IMAGE_URL, {});
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
