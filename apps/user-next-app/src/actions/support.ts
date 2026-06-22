"use server";

import { serverFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api.endpoints";
import type { AppApiResponse } from "@/types/video.types";
import type { CreateSupportFormRequest, CreateSupportFormResponse } from "@/types/support.types";

export async function createSupportFormAction(
  data: CreateSupportFormRequest
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await serverFetch<AppApiResponse<CreateSupportFormResponse>>(
      API_ENDPOINTS.CREATE_SUPPORT_FORM,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (response.error) {
      console.error("[support.action] Create support form failed:", response.error);
      return { success: false, error: response.error.errorMsg || "Failed to submit form" };
    }

    return { success: true };
  } catch (error) {
    console.error("[support.action] Exception while creating form:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
