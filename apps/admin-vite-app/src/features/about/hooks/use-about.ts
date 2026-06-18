import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { aboutApi } from "../api/about.api";

export function useAbout() {
  return useQuery({
    queryKey: queryKeys.content.about(),
    queryFn: async () => {
      const res = await aboutApi.get();
      return res.data;
    },
  });
}

export function useUpdateAbout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aboutApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.about() });
    },
  });
}
