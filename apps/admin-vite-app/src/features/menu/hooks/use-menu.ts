import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "../api/menu.api";
import type { NavMenuItem } from "../types/menu.types";

export function useMenuConfig() {
  return useQuery({
    queryKey: ["content", "menu"],
    queryFn: async () => {
      const res = await menuApi.get();
      return res.data;
    },
  });
}

export function useUpdateMenuConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: menuApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "menu"] });
    },
  });
}
