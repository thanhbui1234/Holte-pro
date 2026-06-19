import { useState } from "react";
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useUploadContext } from "@/shared/context/UploadContext";
import { cn } from "@/shared/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Button } from "shared-ui";

export function GlobalUploadProgress() {
  const { jobs, removeJob, cancelJob } = useUploadContext();
  const [jobToCancel, setJobToCancel] = useState<string | null>(null);

  if (jobs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-[350px]">
      {jobs.map((job) => (
        <div 
          key={job.id}
          className="bg-card text-card-foreground shadow-lg border rounded-lg p-4 animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-start gap-3 overflow-hidden">
              <div className={cn(
                "p-2 rounded-full shrink-0",
                job.status === "uploading" ? "bg-blue-500/10 text-blue-500" :
                job.status === "processing" ? "bg-amber-500/10 text-amber-500" :
                job.status === "success" ? "bg-emerald-500/10 text-emerald-500" :
                "bg-red-500/10 text-red-500"
              )}>
                {job.status === "uploading" ? <Loader2 className="w-5 h-5 animate-spin" /> :
                 job.status === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> :
                 job.status === "success" ? <CheckCircle2 className="w-5 h-5" /> :
                 <AlertCircle className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate" title={job.youtubeTitle}>
                  {job.youtubeTitle || job.file.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {job.status === "uploading" ? "Uploading to YouTube..." :
                   job.status === "processing" ? "Saving to database..." :
                   job.status === "success" ? "Upload complete!" :
                   "Upload failed"}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (job.status === "uploading" || job.status === "processing") {
                  setJobToCancel(job.id);
                } else {
                  removeJob(job.id);
                }
              }}
              className="text-muted-foreground hover:text-foreground shrink-0 p-1 rounded-md hover:bg-muted/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {(job.status === "uploading" || job.status === "processing") && (
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                <span>{job.progress}%</span>
                <span>{job.status === "processing" ? "Please wait..." : "Uploading..."}</span>
              </div>
              <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    job.status === "processing" ? "bg-amber-500 w-full animate-pulse" : "bg-blue-500"
                  )}
                  style={{ width: job.status === "processing" ? "100%" : `${job.progress}%` }}
                />
              </div>
            </div>
          )}

          {job.status === "error" && job.error && (
            <div className="mt-2 text-xs text-red-500 bg-red-500/10 p-2 rounded-md">
              {job.error}
            </div>
          )}
        </div>
      ))}

      <Dialog open={!!jobToCancel} onOpenChange={(open) => !open && setJobToCancel(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancel Upload</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel the video upload? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setJobToCancel(null)}>
              No, keep uploading
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (jobToCancel) {
                  cancelJob(jobToCancel);
                  setJobToCancel(null);
                }
              }}
            >
              Yes, cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
