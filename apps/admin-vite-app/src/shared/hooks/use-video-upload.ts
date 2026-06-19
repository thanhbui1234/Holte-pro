import { useState } from "react";
import { videoApi } from "@/shared/api";
import type { UploadVideoResponse } from "@/shared/api/video.api";

export interface UseVideoUploadOptions {
  onSuccess?: (data: UploadVideoResponse) => void;
  onError?: (error: unknown) => void;
  youtubeTitle?: string;
  youtubeDescription?: string;
  privacyStatus?: "public" | "unlisted" | "private";
}

export function useVideoUpload(defaultOptions?: UseVideoUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (
    file: File,
    overrideOptions?: UseVideoUploadOptions
  ) => {
    const options = { ...defaultOptions, ...overrideOptions };
    
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("youtubeTitle", options.youtubeTitle || "Uploaded Video");
      if (options.youtubeDescription) {
        formData.append("youtubeDescription", options.youtubeDescription);
      }
      formData.append("privacyStatus", options.privacyStatus || "unlisted");
      
      const res = await videoApi.upload(formData);
      const data = res.data.data;
      
      // Auto-save the uploaded video to the database
      await videoApi.create({
        youtubeVideoId: data.youtubeVideoId,
        title: options.youtubeTitle || "Uploaded Video",
        description: options.youtubeDescription,
        privacyStatus: options.privacyStatus || "unlisted",
        fileSize: file.size,
        visible: true,
      });
      
      options.onSuccess?.(data);
      return data;
    } catch (error) {
      console.error("Upload failed", error);
      options.onError?.(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}
