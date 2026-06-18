import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "shared-api/query-keys";
import { filmsApi } from "../api/films.api";
import type { FilmItem } from "../types/films.types";

export function useFilms() {
  return useQuery({
    queryKey: queryKeys.content.films(),
    queryFn: async () => {
      const res = await filmsApi.getList();
      return res.data.data.videos as unknown as FilmItem[];
    },
  });
}

export function useCreateFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FilmItem) => filmsApi.create(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.films() });
    },
  });
}

export function useUpdateFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FilmItem) => {
      // Mock update
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.films() });
    },
  });
}

export function useRemoveFilm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => filmsApi.remove(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.content.films() });
    },
  });
}

// Mock config for UI
const MOCK_CONFIG = {
  titlePrefix: "Hà Nội",
  titleHighlight: "Traditional Films",
  backgroundColor: "#f5f5f4",
};

export function useFilmsConfig() {
  return useQuery({
    queryKey: ["content", "filmsConfig"],
    queryFn: async () => MOCK_CONFIG,
  });
}

export function useUpdateFilmsConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "filmsConfig"] });
    },
  });
}
