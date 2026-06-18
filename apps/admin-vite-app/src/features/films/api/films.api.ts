import { videoApi } from "@/shared/api";

export const filmsApi = {
  getList: () => videoApi.getList(),
  create: videoApi.create,
  remove: videoApi.remove,
} as const;
