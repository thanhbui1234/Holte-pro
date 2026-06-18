import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { bannerApi } from "../api/banner.api";

export function useBanner() {
  return useQuery({
    queryKey: queryKeys.content.banner(),
    queryFn: async () => {
      const res = await bannerApi.get();
      return res.data;
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bannerApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.banner() });
    },
  });
}
