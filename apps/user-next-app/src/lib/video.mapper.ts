import type { VideoRecord } from "@/types/video.types";
import type {
  HighlightSectionItem,
  ReelSectionItem,
  WeddingHighlightsSectionData,
  WeddingReelsSectionData,
  TraditionalFilmSectionItem,
  TraditionalFilmsSectionData,
  SectionRecord,
} from "@/types/video.types";
import type { HighlightVideo, ReelItem, FilmItem } from "@/types/content";
import type { CustomSection } from "shared-ui/canvas";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Extract a bare YouTube video ID from any YouTube URL format:
 *   https://www.youtube.com/embed/<id>
 *   https://www.youtube.com/watch?v=<id>
 *   https://youtu.be/<id>
 */
function extractYouTubeId(url: string): string {
  if (!url) return "";
  const embedMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];
  return url; // fallback — assume raw ID was passed
}

/**
 * Build a proper YouTube embed URL (with autoplay) from any YouTube URL or bare ID.
 */
export function toYouTubeEmbedUrl(urlOrId: string): string {
  const id = extractYouTubeId(urlOrId);
  return `https://www.youtube.com/embed/${id}?autoplay=1`;
}

// ---------------------------------------------------------------------------
// Section-based mappers (primary — reads from GET_LIST_SECTION response)
// ---------------------------------------------------------------------------

/** Find a section by its `name` field and cast its data.map to the expected type. */
export function findSection<T>(
  sections: SectionRecord[],
  name: string,
): T | null {
  const section = sections.find((s) => s.name === name && s.status === "ACTIVE" && !s.data.empty);
  if (!section) return null;
  return section.data.map as T;
}

/** Map `wedding-highlights` section item → HighlightVideo (uses YouTube embed URL) */
export function mapHighlightItemToVideo(
  item: HighlightSectionItem,
): HighlightVideo {
  return {
    id: extractYouTubeId(item.videoUrl),
    title: item.title,
    subtitle: item.subtitle ?? "",
  };
}

/** Map the full `wedding-highlights` section data → HighlightVideo[] */
export function mapHighlightSectionToVideos(
  data: WeddingHighlightsSectionData,
): HighlightVideo[] {
  return (data.items ?? []).map(mapHighlightItemToVideo);
}

/** Map `wedding-reels` section item → ReelItem (uses YouTube embed URL) */
export function mapReelItemToReel(item: ReelSectionItem): ReelItem {
  return {
    title: item.title,
    duration: item.duration ?? "",
    location: item.location ?? "",
    youtubeUrl: item.youtubeUrl || item.videoUrl || undefined,
  };
}

/** Map the full `wedding-reels` section data → ReelItem[] */
export function mapReelSectionToReels(
  data: WeddingReelsSectionData,
): ReelItem[] {
  return (data.items ?? []).map(mapReelItemToReel);
}

/** Map `traditional-films` section item → FilmItem */
export function mapTraditionalFilmItemToFilm(
  item: TraditionalFilmSectionItem,
): FilmItem {
  const embedUrl = item.youtubeUrl || item.videoUrl || "";
  const ytId = extractYouTubeId(embedUrl);
  const image = item.image || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "");
  return {
    id: ytId,
    title: item.title,
    subtitle: item.subtitle ?? "",
    description: item.description ?? "",
    tags: item.tags ?? [],
    image,
    youtubeEmbedUrl: embedUrl ? toYouTubeEmbedUrl(embedUrl) : "",
  };
}

/** Map the full `traditional-films` section data → FilmItem[] */
export function mapTraditionalFilmSectionToFilms(
  data: TraditionalFilmsSectionData,
): FilmItem[] {
  return (data.items ?? []).map(mapTraditionalFilmItemToFilm);
}

// ---------------------------------------------------------------------------
// Custom section mappers (type === "CUSTOM" from GET_LIST_SECTION)
// ---------------------------------------------------------------------------

export function mapCustomSection(record: SectionRecord): CustomSection {
  const map = (record.data?.map ?? {}) as Record<string, unknown>;
  return {
    id: String(record.id),
    name: record.name,
    slug: (map.slug as string) ?? record.name,
    visible: record.status === "ACTIVE",
    paddingY: (map.paddingY as CustomSection["paddingY"]) ?? "lg",
    blocks: (map.blocks as CustomSection["blocks"]) ?? [],
    layoutMode: "canvas",
    canvasElements: (map.canvasElements as CustomSection["canvasElements"]) ?? [],
    canvasHeight: (map.canvasHeight as number) ?? 900,
    backgroundColor: (map.backgroundColor as string) ?? "#ffffff",
    backgroundType: (map.backgroundType as CustomSection["backgroundType"]) ?? "solid",
    bgGradientAngle: (map.bgGradientAngle as number) ?? 135,
    bgGradientFrom: (map.bgGradientFrom as string) ?? "#ffffff",
    bgGradientTo: (map.bgGradientTo as string) ?? "#f5f5f4",
    bgImage: (map.bgImage as string) ?? "",
    bgImageOverlay: (map.bgImageOverlay as string) ?? "#000000",
    bgImageOverlayOpacity: (map.bgImageOverlayOpacity as number) ?? 30,
    createdAt: record.createdTime,
    updatedAt: record.updatedTime,
  };
}

/** Filter and map all active CUSTOM sections, sorted by displayOrder. */
export function findCustomSections(sections: SectionRecord[]): CustomSection[] {
  return sections
    .filter((s) => s.type === "CUSTOM" && s.status === "ACTIVE" && !s.data.empty)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(mapCustomSection);
}

// ---------------------------------------------------------------------------
// Legacy VideoRecord mappers (kept for /wedding-highlight etc. pages)
// ---------------------------------------------------------------------------

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
    youtubeEmbedUrl: video.youtubeEmbedUrl || toYouTubeEmbedUrl(video.youtubeVideoId),
  };
}
