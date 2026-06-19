import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionApi } from "@/shared/api";
import type { CreateSectionRequest, UpdateSectionRequest } from "@/shared/api";

export const SECTION_KEYS = {
  all: ["sections"] as const,
  lists: () => [...SECTION_KEYS.all, "list"] as const,
  list: (filters: string) => [...SECTION_KEYS.lists(), { filters }] as const,
  details: () => [...SECTION_KEYS.all, "detail"] as const,
  detail: (id: number) => [...SECTION_KEYS.details(), id] as const,
};

export function useSectionList(filters?: { name?: string; status?: string }) {
  return useQuery({
    queryKey: SECTION_KEYS.list(JSON.stringify(filters || {})),
    queryFn: async () => {
      const res = await sectionApi.getList(filters);
      return res.data?.data?.sections || [];
    },
  });
}

export function useSection(id: number) {
  return useQuery({
    queryKey: SECTION_KEYS.detail(id),
    queryFn: async () => {
      const res = await sectionApi.getById(id);
      return res.data?.data?.section || null;
    },
    enabled: !!id,
  });
}

export function useCreateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSectionRequest) => sectionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SECTION_KEYS.lists() });
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateSectionRequest) => sectionApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: SECTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: SECTION_KEYS.detail(variables.id) });
    },
  });
}

export function useRemoveSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sectionApi.remove(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: SECTION_KEYS.lists() });
      queryClient.removeQueries({ queryKey: SECTION_KEYS.detail(id) });
    },
  });
}
