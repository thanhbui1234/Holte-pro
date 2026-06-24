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

// ---------------------------------------------------------------------------
// Section API types (GET_LIST_SECTION)
// ---------------------------------------------------------------------------

/** A single item inside the wedding-highlights section */
export interface HighlightSectionItem {
  id: string;
  videoUrl: string;
  title: string;
  subtitle: string;
}

/** Config block shared by most sections */
export interface SectionConfig {
  eyebrow?: string;
  eyebrowColor?: string;
  titlePrefix?: string;
  titlePrefixColor?: string;
  titleHighlight?: string;
  titleHighlightColor?: string;
  description?: string;
  descriptionColor?: string;
  backgroundColor?: string;
}

/** Shape of `data.map` for the `banner` section */
export interface BannerSectionData {
  videoSrc: string;
  logoSrc?: string;
  logoAlt?: string;
  scrollLabel?: string;
}

/** A single image item inside the about section */
export interface AboutSectionImage {
  src: string;
  description: string;
}

/** A single stat item inside the about section */
export interface AboutSectionStat {
  value: string;
  label: string;
}

/** Shape of `data.map` for the `about` section */
export interface AboutSectionData {
  eyebrow?: string;
  eyebrowColor?: string;
  titlePrefix?: string;
  titlePrefixColor?: string;
  titleHighlight?: string;
  titleHighlightColor?: string;
  descriptionEn?: string;
  descriptionEnColor?: string;
  descriptionVi?: string;
  descriptionViColor?: string;
  pillars?: string[];
  legacyLabel?: string;
  backgroundColor?: string;
  stats?: AboutSectionStat[];
  images?: AboutSectionImage[];
}

/** Shape of `data.map` for the `wedding-highlights` section */
export interface WeddingHighlightsSectionData {
  config: SectionConfig;
  items: HighlightSectionItem[];
}

/** A single item inside the wedding-reels section */
export interface ReelSectionItem {
  id: string;
  youtubeUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  duration: string;
  location: string;
}

/** Shape of `data.map` for the `wedding-reels` section */
export interface WeddingReelsSectionData {
  config: SectionConfig;
  items: ReelSectionItem[];
}

/** A single item inside the traditional-films section */
export interface TraditionalFilmSectionItem {
  id: string;
  youtubeUrl: string;
  videoUrl: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image?: string;
}

/** Shape of `data.map` for the `traditional-films` section */
export interface TraditionalFilmsSectionData {
  config: SectionConfig;
  items: TraditionalFilmSectionItem[];
}

/** Shape of `data.map` for the `contact-cta` section */
export interface ContactCtaSectionData {
  eyebrow?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  backgroundColor?: string;
}

/** Shape of `data.map` for the `header` INVARIANT section */
export interface HeaderSectionData {
  facebookUrl?: string;
  instagramUrl?: string;
  emailHref?: string;
}

/** Shape of `data.map` for the `footer` INVARIANT section */
export interface FooterSectionData {
  tagline?: string;
  contactHeading?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialHeading?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  copyright?: string;
  credit?: string;
}

/** Generic section record returned by GET_LIST_SECTION */
export interface SectionRecord {
  id: number;
  name: string;
  description: string | null;
  displayOrder: number;
  status: string;
  type: string | null;
  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map: Record<string, any>;
    empty: boolean;
  };
  createdTime: number;
  updatedTime: number;
}

/** Response shape of GET_LIST_SECTION */
export interface SectionListResponse {
  sections: SectionRecord[];
}
