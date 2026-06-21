import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { sectionApi } from "@/shared/api/section.api";
import type { SectionRecord } from "@/shared/api/section.api";

export function useCustomSections() {
  return useQuery({
    queryKey: queryKeys.sections.list(),
    queryFn: async () => {
      const res = await sectionApi.getList();
      const sections = res.data.data.sections ?? [];
      return [...sections].sort((a, b) => a.displayOrder - b.displayOrder);
    },
  });
}

export function useCreateCustomSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) =>
      sectionApi.create({ name, displayOrder: Math.floor(Date.now() / 1000), data: {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.list() });
    },
  });
}

export function useToggleCustomSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (section: SectionRecord) =>
      sectionApi.update({
        id: section.id,
        name: section.name,
        status: section.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.list() });
    },
  });
}

export function useDeleteCustomSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sectionApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.list() });
    },
  });
}

/** @deprecated Editor page not yet migrated — stub to prevent crash */
export function useUpdateCustomSections() {
  return useMutation({
    mutationFn: async (_data: unknown) => {},
  });
}
