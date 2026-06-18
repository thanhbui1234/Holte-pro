import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { headerApi } from "../api/header.api";

export function useHeader() {
  return useQuery({
    queryKey: ["content", "header"],
    queryFn: async () => {
      const res = await headerApi.get();
      return res.data;
    },
  });
}

export function useUpdateHeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: headerApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "header"] });
    },
  });
}
