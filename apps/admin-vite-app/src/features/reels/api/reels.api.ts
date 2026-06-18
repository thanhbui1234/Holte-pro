import { videoApi } from "@/shared/api";

export const reelsApi = {
  getList: () => videoApi.getList(),
  create: videoApi.create,
  remove: videoApi.remove,
} as const;
