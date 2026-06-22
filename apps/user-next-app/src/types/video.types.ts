/** API response wrapper from backend */
export interface AppApiResponse<T> {
  cmdId: string;
  cmdTime: number;
  triggerId: string;
  method: string;
  path: string;
  data: T;
  error?: { errorMsg: string; errorCode: number };
}

/** Video record returned by /app-api/v1/get-list-video */
export interface VideoRecord {
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

/** Request body for /app-api/v1/get-list-video */
export interface AppVideoListRequest {
  categoryIds?: number[];
  statuses?: string[];
}

/** Video category enum matching backend */
export const VideoCategory = {
  WEDDING: 1,
  FUNERAL: 2,
  ENGAGEMENT: 3,
  OUTDOOR: 4,
} as const;

export type VideoCategoryId = (typeof VideoCategory)[keyof typeof VideoCategory];
