import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionApi } from "@/shared/api/section.api";
import type { HeaderData } from "../types/header.types";

const QUERY_KEY = ["content", "header"] as const;

export function useHeader() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await sectionApi.getList({ name: "header" });
      const section = (res.data.data.sections ?? [])[0];
      if (!section) return null;
      return { sectionId: section.id, ...(section.data?.map as HeaderData) };
    },
  });
}

export function useUpdateHeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: HeaderData) => {
      const cached = queryClient.getQueryData<{ sectionId: number } & HeaderData>(QUERY_KEY);
      if (!cached?.sectionId) throw new Error("Header section not loaded");
      return sectionApi.update({ id: cached.sectionId, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
