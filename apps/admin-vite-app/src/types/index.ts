/**
 * Single source of truth for every field the user-facing site renders.
 * Each interface mirrors a concrete visible region of apps/user-next-app.
 */
import type { CustomSection } from "shared-ui";

export interface HighlightVideo {
  id: string;
  videoUrl: string;
  title: string;
  subtitle: string;
}

export interface ReelItem {
  id: string;
  youtubeUrl: string;
  videoUrl: string;
  title: string;
  description: string;
  duration: string;
  location: string;
}

export interface FilmPreviewImage {
  src: string;
  title: string;
  topic: string;
  description: string;
  attribute: string;
}

export interface FilmItem {
  id: string;
  youtubeUrl: string;
  videoUrl: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  previewImages: FilmPreviewImage[];
}

export interface AboutImage {
  src: string;
  description: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface AboutData {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  descriptionEn: string;
  descriptionVi: string;
  pillars: string[];
  legacyLabel: string;
  stats: AboutStat[];
  images: AboutImage[];
  backgroundColor: string;
}

export interface BannerData {
  videoSrc: string;
  logoSrc: string;
  logoAlt: string;
  scrollLabel: string;
}

export interface HeaderData {
  facebookUrl: string;
  instagramUrl: string;
  emailHref: string;
}

export interface ThemedSection {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  backgroundColor: string;
}

export interface ContactCtaData {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundColor: string;
}

export interface FooterData {
  tagline: string;
  contactHeading: string;
  phone: string;
  email: string;
  address: string;
  socialHeading: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  copyright: string;
  credit: string;
}

export interface Collection<TConfig, TItem> {
  config: TConfig;
  items: TItem[];
}

/**
 * Sections that can be reordered + toggled on the homepage.
 * Banner, header, footer and contactCta are fixed and intentionally NOT here.
 */
export type LayoutSectionKey = "about" | "highlights" | "reels" | "films";

export interface LayoutSection {
  key: LayoutSectionKey;
  visible: boolean;
}

export interface NavMenuItem {
  id: string;
  label: string;
  href: string;
  visible: boolean;
}

export type ContactStatus = "new" | "read" | "archived";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  weddingDate: string;
  message: string;
  status: ContactStatus;
  receivedAt: number;
}

export interface AdminState {
  banner: BannerData;
  header: HeaderData;
  about: AboutData;
  highlights: Collection<ThemedSection, HighlightVideo>;
  reels: Collection<ThemedSection, ReelItem>;
  films: Collection<ThemedSection, FilmItem>;
  contactCta: ContactCtaData;
  footer: FooterData;
  layout: LayoutSection[];
  menuConfig: NavMenuItem[];
  customSections: CustomSection[];
  contactSubmissions: ContactSubmission[];
}

export type CollectionKey = "highlights" | "reels" | "films";

export type CollectionItemMap = {
  highlights: HighlightVideo;
  reels: ReelItem;
  films: FilmItem;
};


// Canvas types live in shared-ui — re-exported here for backwards compatibility
export type {
  BlockType,
  CanvasBgType,
  CanvasElement,
  TextBlock,
  ImageItem,
  ImageGalleryBlock,
  VideoBlock,
  CtaButtonBlock,
  ContentBlock,
  CustomSection,
} from "shared-ui";
