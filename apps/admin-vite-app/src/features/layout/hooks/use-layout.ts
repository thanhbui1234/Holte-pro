import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { layoutApi } from "../api/layout.api";
import type { LayoutSection } from "../types/layout.types";

export function useLayout() {
  return useQuery({
    queryKey: ["content", "layout"],
    queryFn: async () => {
      const res = await layoutApi.get();
      return res.data;
    },
  });
}

export function useUpdateLayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: layoutApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "layout"] });
    },
  });
}
