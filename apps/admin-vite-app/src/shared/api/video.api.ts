import { apiClient, API_ENDPOINTS } from "@/shared/api";

interface CmsApiResponse<T> {
  cmdId: string;
  cmdTime: number;
  data: T;
  error?: { errorMsg: string; errorCode: number };
}

interface VideoRecord {
  id: number;
  userId: number;
  youtubeVideoId: string;
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  youtubeThumbnailUrl: string;
  youtubeMediumThumbnailUrl: string;
  youtubeHighThumbnailUrl: string;
  title: string;
  description: string;
  tags: string[];
  fileSize: number;
  status: string;
  privacyStatus: string;
  categoryId: number;
  visible: boolean;
  createdTime: number;
  updatedTime: number;
}

export interface UploadVideoResponse {
  youtubeVideoId: string;
  youtubeUrl: string;
  youtubeEmbedUrl: string;
  youtubeThumbnailUrl: string;
  youtubeMediumThumbnailUrl: string;
  youtubeHighThumbnailUrl: string;
}

interface CreateVideoRequest {
  youtubeVideoId: string;
  title: string;
  description?: string;
  tags?: string[];
  fileSize?: number;
  privacyStatus?: string;
  categoryId?: number;
  visible?: boolean;
}

export const videoApi = {
  /** Upload video file to YouTube (multipart/form-data) */
  upload: (formData: FormData, onUploadProgress?: (progressEvent: any) => void, signal?: AbortSignal) =>
    apiClient.post<CmsApiResponse<UploadVideoResponse>>(
      API_ENDPOINTS.UPLOAD_VIDEO,
      formData,
      {
        headers: { "Content-Type": undefined as any },
        timeout: 0, // Vô hiệu hoá timeout cho request upload file nặng
        onUploadProgress,
        signal,
      },
    ),

  /** Save video metadata to DB after YouTube upload */
  create: (data: CreateVideoRequest) =>
    apiClient.post<CmsApiResponse<CreateVideoRequest & { videoId: number; status: string }>>(
      API_ENDPOINTS.CREATE_VIDEO,
      data,
    ),

  /** List all videos for current user */
  getList: () =>
    apiClient.post<CmsApiResponse<{ videos: VideoRecord[] }>>(
      API_ENDPOINTS.GET_LIST_VIDEO,
      {},
    ),

  /** Get video detail by ID */
  getById: (videoId: number) =>
    apiClient.post<CmsApiResponse<{ videoId: number; video: VideoRecord }>>(
      API_ENDPOINTS.GET_VIDEO,
      { videoId },
    ),

  /** Remove video from DB (async delete on YouTube) */
  remove: (videoId: number) =>
    apiClient.post<CmsApiResponse<{ videoId: number; result: boolean }>>(
      API_ENDPOINTS.REMOVE_VIDEO,
      { data: { videoId } },
    ),
} as const;
