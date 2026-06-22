import { serverFetch } from "./api";
import { API_ENDPOINTS } from "./api.endpoints";
import type {
  AppApiResponse,
  VideoRecord,
  AppVideoListRequest,
  SectionRecord,
  SectionListResponse,
} from "@/types/video.types";

/**
 * Fetch the public sections list from the backend.
 * Revalidates every hour; tagged "sections" for on-demand revalidation.
 */
export async function getAppSections(): Promise<SectionRecord[]> {
  try {
    const response = await serverFetch<AppApiResponse<SectionListResponse>>(
      API_ENDPOINTS.GET_LIST_SECTION,
      {
        method: "POST",
        body: JSON.stringify({}),
        next: {
          revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
          tags: ["sections"],
        },
      },
    );

    if (response.error) {
      console.error("[video.api] API error:", response.error.errorMsg);
      return [];
    }

    return response.data.sections ?? [];
  } catch (error) {
    console.error("[video.api] Failed to fetch sections:", error);
    return [];
  }
}

/**
 * Fetch the public video list (legacy — used by /wedding-highlight etc.).
 * Revalidates every hour; tagged "videos" for on-demand revalidation.
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
        revalidate: process.env.NODE_ENV === "development" ? 0 : 3600,
        tags: ["videos"],
      },
    });

    if (response.error) {
      console.error("[video.api] API error:", response.error.errorMsg);
      return [];
    }

    return response.data.videos ?? [];
  } catch (error) {
    console.error("[video.api] Failed to fetch videos:", error);
    return [];
  }
}
