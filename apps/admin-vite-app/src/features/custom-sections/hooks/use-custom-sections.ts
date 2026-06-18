import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customSectionsApi } from "../api/custom-sections.api";
import type { CustomSection } from "shared-ui";

export function useCustomSections() {
  return useQuery({
    queryKey: ["content", "custom-sections"],
    queryFn: async () => {
      const res = await customSectionsApi.getList();
      return res.data;
    },
  });
}

export function useUpdateCustomSections() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customSectionsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "custom-sections"] });
    },
  });
}
