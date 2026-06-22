import { serverFetch } from "./api";
import { API_ENDPOINTS } from "./api.endpoints";
import type {
  AppApiResponse,
  VideoRecord,
  AppVideoListRequest,
} from "@/types/video.types";

/**
 * Fetch public video list from backend.
 * Uses Next.js fetch caching: revalidates every hour, tagged "videos" for on-demand revalidation.
 */
export async function getAppVideoList(
  params: AppVideoListRequest = {},
): Promise<VideoRecord[]> {
  try {
    const response = await serverFetch<
      AppApiResponse<{ videos: VideoRecord[] }>
    >(API_ENDPOINTS.GET_LIST_VIDEO, {
      method: "POST",
      body: JSON.stringify(params),
      next: {
        revalidate: 3600,
        tags: ["videos"],
      },
    });

    if (response.error) {
      console.error("[video.api] API error:", response.error.errorMsg);
      return [];
    }

    return response.data.videos;
  } catch (error) {
    console.error("[video.api] Failed to fetch videos:", error);
    return [];
  }
}
