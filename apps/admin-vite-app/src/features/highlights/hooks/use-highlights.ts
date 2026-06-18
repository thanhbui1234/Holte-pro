import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { highlightsApi } from "../api/highlights.api";
import type { HighlightVideo } from "../types/highlights.types";

export function useHighlights() {
  return useQuery({
    queryKey: queryKeys.content.highlights(),
    queryFn: async () => {
      const res = await highlightsApi.getList();
      return res.data.data.videos as unknown as HighlightVideo[];
    },
  });
}

export function useCreateHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: HighlightVideo) => highlightsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.highlights() });
    },
  });
}

export function useUpdateHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: HighlightVideo) => {
      // Mock update
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.highlights() });
    },
  });
}

export function useRemoveHighlight() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => highlightsApi.remove(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.highlights() });
    },
  });
}

const MOCK_CONFIG = {
  titlePrefix: "Wedding",
  titleHighlight: "Highlights",
  backgroundColor: "#ffffff",
};

export function useHighlightsConfig() {
  return useQuery({
    queryKey: ["content", "highlightsConfig"],
    queryFn: async () => MOCK_CONFIG,
  });
}

export function useUpdateHighlightsConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "highlightsConfig"] });
    },
  });
}
