import { useUploadContext } from "@/shared/context/UploadContext";
import type { UploadVideoResponse } from "@/shared/api/video.api";

export interface UseVideoUploadOptions {
  onSuccess?: (data: UploadVideoResponse) => void;
  onError?: (error: unknown) => void;
  youtubeTitle?: string;
  youtubeDescription?: string;
  privacyStatus?: "public" | "unlisted" | "private";
}

export function useVideoUpload(defaultOptions?: UseVideoUploadOptions) {
  const { startUpload } = useUploadContext();

  const upload = async (
    file: File,
    overrideOptions?: UseVideoUploadOptions
  ) => {
    const options = { ...defaultOptions, ...overrideOptions };
    
    startUpload(file, {
      youtubeTitle: options.youtubeTitle || "Uploaded Video",
      youtubeDescription: options.youtubeDescription,
      privacyStatus: options.privacyStatus || "unlisted"
    });
    
    // Call onSuccess immediately so UI can close modal
    // Background upload manager handles the real progress/success
    options.onSuccess?.({} as any);
    return {} as any;
  };

  return { upload, isUploading: false };
}
