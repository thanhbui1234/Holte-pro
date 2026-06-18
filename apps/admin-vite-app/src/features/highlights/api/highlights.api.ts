import { videoApi } from "@/shared/api";

export const highlightsApi = {
  getList: () => videoApi.getList(),
  create: videoApi.create,
  remove: videoApi.remove,
} as const;
