import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { videoApi } from "@/shared/api";
import { triggerNextJsRevalidate } from "@/shared/api/revalidate";
export type UploadStatus = "uploading" | "processing" | "success" | "error";

export interface UploadJob {
  id: string;
  file: File;
  youtubeTitle: string;
  youtubeDescription?: string;
  privacyStatus: "public" | "unlisted" | "private";
  progress: number;
  status: UploadStatus;
  error?: string;
}

interface UploadContextType {
  jobs: UploadJob[];
  startUpload: (
    file: File,
    options: {
      youtubeTitle: string;
      youtubeDescription?: string;
      privacyStatus: "public" | "unlisted" | "private";
    }
  ) => void;
  removeJob: (id: string) => void;
  cancelJob: (id: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const queryClient = useQueryClient();

  const updateJob = useCallback((id: string, update: Partial<UploadJob>) => {
    setJobs((prev) => prev.map((job) => (job.id === id ? { ...job, ...update } : job)));
  }, []);

  const removeJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  }, []);

  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const cancelJob = useCallback((id: string) => {
    const controller = abortControllersRef.current.get(id);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(id);
    }
    removeJob(id);
  }, [removeJob]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const isUploading = jobs.some(j => j.status === "uploading" || j.status === "processing");
      if (isUploading) {
        e.preventDefault();
        e.returnValue = "You have active uploads. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [jobs]);

  const startUpload = useCallback(
    async (
      file: File,
      options: {
        youtubeTitle: string;
        youtubeDescription?: string;
        privacyStatus: "public" | "unlisted" | "private";
      }
    ) => {
      // Use standard random generation
      const jobId = Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const newJob: UploadJob = {
        id: jobId,
        file,
        youtubeTitle: options.youtubeTitle,
        youtubeDescription: options.youtubeDescription,
        privacyStatus: options.privacyStatus,
        progress: 0,
        status: "uploading",
      };

      setJobs((prev) => [...prev, newJob]);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("youtubeTitle", options.youtubeTitle);
        if (options.youtubeDescription) {
          formData.append("youtubeDescription", options.youtubeDescription);
        }
        formData.append("privacyStatus", options.privacyStatus);

        const abortController = new AbortController();
        abortControllersRef.current.set(jobId, abortController);

        const res = await videoApi.upload(formData, (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            updateJob(jobId, { progress: percentCompleted });
          }
        }, abortController.signal);

        abortControllersRef.current.delete(jobId);
        updateJob(jobId, { status: "processing", progress: 100 });

        const data = res.data.data;

        await videoApi.create({
          youtubeVideoId: data.youtubeVideoId,
          title: options.youtubeTitle,
          description: options.youtubeDescription,
          privacyStatus: options.privacyStatus,
          fileSize: file.size,
          visible: true,
        });

        updateJob(jobId, { status: "success" });
        queryClient.invalidateQueries({ queryKey: ["video-list"] });
        
        // Trigger Next.js cache revalidation
        triggerNextJsRevalidate("videos");

        // Auto remove successful job after 3s
        setTimeout(() => removeJob(jobId), 3000);
      } catch (error) {
        console.error("Upload job failed", error);
        updateJob(jobId, { 
          status: "error", 
          error: error instanceof Error ? error.message : "Upload failed" 
        });
        // Remove error job after 5s
        setTimeout(() => removeJob(jobId), 5000);
      }
    },
    [updateJob, removeJob, queryClient]
  );

  const value = useMemo(
    () => ({ jobs, startUpload, removeJob, cancelJob }),
    [jobs, startUpload, removeJob, cancelJob]
  );

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}

export function useUploadContext() {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadContext must be used within an UploadProvider");
  }
  return context;
}
