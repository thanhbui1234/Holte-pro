/**
 * Barrel re-export — all domain types accessible from @/shared/types.
 * Provides backwards compatibility for existing @/types imports.
 */

// Domain types
export type { BannerData } from "@/features/banner/types/banner.types";
export type { HeaderData } from "@/features/header/types/header.types";
export type { AboutData, AboutImage, AboutStat } from "@/features/about/types/about.types";
export type { HighlightVideo } from "@/features/highlights/types/highlights.types";
export type { ReelItem } from "@/features/reels/types/reels.types";
export type { FilmItem } from "@/features/films/types/films.types";
export type { ContactCtaData, ContactStatus, SupportFormRecord } from "@/features/contact/types/contact.types";
export type { FooterData } from "@/features/footer/types/footer.types";
export type { SectionRecord } from "@/features/layout/types/layout.types";

// Shared/composed types
export type { ThemedSection } from "./common.types";
// Deleted AdminState and Collection types from old architecture

// Canvas types from shared-ui
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
