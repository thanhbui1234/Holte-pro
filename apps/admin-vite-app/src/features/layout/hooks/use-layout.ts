import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { sectionApi } from "@/shared/api/section.api";
import type { SectionRecord, UpdateSectionRequest } from "shared-api";

export function useSection(id: number) {
  return useQuery({
    queryKey: queryKeys.sections.detail(id),
    queryFn: async () => {
      const res = await sectionApi.getById(id);
      return res.data.data.section;
    },
    enabled: !!id,
  });
}

export function useUpdateSectionData() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSectionRequest) => sectionApi.update(payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.list() });
    },
  });
}

export function useSections() {
  return useQuery({
    queryKey: queryKeys.sections.list(),
    queryFn: async () => {
      const res = await sectionApi.getList();
      const sections = res.data.data.sections ?? [];
      return [...sections]
        .filter((s) => s.type !== "INVARIANT")
        .sort((a, b) => a.displayOrder - b.displayOrder);
    },
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateSectionRequest) => sectionApi.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.list() });
    },
  });
}

export function useUpdateSectionOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    // Fires before mutationFn — apply new order to cache immediately so the
    // UI never sees stale data. The page clears localOrder in its own onMutate
    // callback (which TanStack Query guarantees runs after this one), so by the
    // time React re-renders both localOrder and the cache are already correct.
    onMutate: async (incoming: Pick<SectionRecord, "id" | "name">[]) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.sections.list() });

      const snapshot = queryClient.getQueryData<SectionRecord[]>(queryKeys.sections.list());

      const orderMap = new Map(incoming.map((s, i) => [s.id, i]));
      queryClient.setQueryData<SectionRecord[]>(
        queryKeys.sections.list(),
        (prev = []) =>
          [...prev].sort((a, b) => {
            const ai = orderMap.get(a.id) ?? Infinity;
            const bi = orderMap.get(b.id) ?? Infinity;
            return ai - bi;
          }),
      );

      return { snapshot };
    },

    mutationFn: (sections: Pick<SectionRecord, "id" | "name">[]) =>
      reorderSections(sections),

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(queryKeys.sections.list(), context?.snapshot);
    },

    // Sync once with server after the sequential updates complete.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sections.list() });
    },
  });
}

/**
 * Assigns displayOrder = base + index where base = Unix timestamp (seconds).
 *
 * Collision-free because:
 * - Unix seconds ≈ 1_750_000_000, far above any realistic displayOrder value.
 * - base changes every second so consecutive reorders never share a slot.
 * - Sequential (not parallel) removes server-side race conditions.
 * - Fits INT32 (max 2_147_483_647) for the next ~10 years.
 */
async function reorderSections(
  sections: Pick<SectionRecord, "id" | "name">[],
): Promise<void> {
  const base = Math.floor(Date.now() / 1000);
  for (const [i, s] of sections.entries()) {
    await sectionApi.update({ id: s.id, name: s.name, displayOrder: base + i });
  }
}
