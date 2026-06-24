import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionApi } from "@/shared/api/section.api";
import type { FooterData } from "../types/footer.types";

const QUERY_KEY = ["content", "footer"] as const;

export function useFooter() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const res = await sectionApi.getList({ name: "footer" });
      const section = (res.data.data.sections ?? [])[0];
      if (!section) return null;
      return { sectionId: section.id, ...(section.data?.map as FooterData) };
    },
  });
}

export function useUpdateFooter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FooterData) => {
      const cached = queryClient.getQueryData<{ sectionId: number } & FooterData>(QUERY_KEY);
      if (!cached?.sectionId) throw new Error("Footer section not loaded");
      return sectionApi.update({ id: cached.sectionId, data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
}
