import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { sectionApi } from "@/shared/api";
import type { CreateSectionRequest, UpdateSectionRequest } from "@/shared/api";

export function useSectionList(filters?: { name?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.sections.list(filters),
    queryFn: async () => {
      const res = await sectionApi.getList(filters);
      return res.data?.data?.sections ?? [];
    },
  });
}

export function useSection(id: number) {
  return useQuery({
    queryKey: queryKeys.sections.detail(id),
    queryFn: async () => {
      const res = await sectionApi.getById(id);
      return res.data?.data?.section ?? null;
    },
    enabled: !!id,
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSectionRequest) => sectionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSectionRequest) => sectionApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.detail(variables.id) });
    },
  });
}

export function useRemoveSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sectionApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.all });
      queryClient.removeQueries({ queryKey: queryKeys.sections.detail(id) });
    },
  });
}
