import { serverFetch } from "./api";
import { API_ENDPOINTS } from "./api.endpoints";

import type { AppApiResponse } from "@/types/video.types";

export async function getWebPreviewImageUrl(): Promise<string | null> {
  try {
    // We use serverFetch because this runs on Next.js server side.
    const response = await serverFetch<AppApiResponse<{ imageUrl: string | null }>>(
      API_ENDPOINTS.GET_WEB_PREVIEW_IMAGE_URL,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    );

    if (response.error) {
      console.error("[seo.api] API error:", response);
      return null;
    }

    return response.data?.imageUrl || null;
  } catch (error) {
    console.error("Failed to fetch web preview image url:", error);
    return null;
  }
}
