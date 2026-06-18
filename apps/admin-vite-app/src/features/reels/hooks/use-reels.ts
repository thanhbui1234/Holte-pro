import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { reelsApi } from "../api/reels.api";
import type { ReelItem } from "../types/reels.types";

export function useReels() {
  return useQuery({
    queryKey: queryKeys.content.reels(),
    queryFn: async () => {
      const res = await reelsApi.getList();
      return res.data.data.videos as unknown as ReelItem[];
    },
  });
}

export function useCreateReel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReelItem) => reelsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.reels() });
    },
  });
}

export function useUpdateReel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ReelItem) => {
      // Mock update
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.reels() });
    },
  });
}

export function useRemoveReel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => reelsApi.remove(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.reels() });
    },
  });
}

const MOCK_CONFIG = {
  titlePrefix: "Wedding",
  titleHighlight: "Reels",
  backgroundColor: "#ffffff",
};

export function useReelsConfig() {
  return useQuery({
    queryKey: ["content", "reelsConfig"],
    queryFn: async () => MOCK_CONFIG,
  });
}

export function useUpdateReelsConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "reelsConfig"] });
    },
  });
}
