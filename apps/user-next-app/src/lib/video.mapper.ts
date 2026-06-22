import type { VideoRecord } from "@/types/video.types";
import type { HighlightVideo, ReelItem, FilmItem } from "@/types/content";

/** Map VideoRecord → HighlightVideo (used by WeddingHighlightSection) */
export function mapToHighlightVideo(video: VideoRecord): HighlightVideo {
  return {
    id: video.youtubeVideoId,
    title: video.title,
    subtitle: video.description || "",
  };
}

/** Map VideoRecord → ReelItem (used by WeddingReelsSection) */
export function mapToReelItem(video: VideoRecord): ReelItem {
  return {
    title: video.title,
    duration: "",
    location: "",
  };
}

/** Map VideoRecord → FilmItem (used by TraditionalFilmPage) */
export function mapToFilmItem(video: VideoRecord): FilmItem {
  return {
    id: video.youtubeVideoId,
    title: video.title,
    subtitle: video.description || "",
    description: video.description || "",
    tags: video.tags ?? [],
    image: video.youtubeHighThumbnailUrl || video.youtubeMediumThumbnailUrl || "",
  };
}
