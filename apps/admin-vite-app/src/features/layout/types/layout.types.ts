export type LayoutSectionKey = "about" | "highlights" | "reels" | "films";

export interface LayoutSection {
  key: LayoutSectionKey;
  visible: boolean;
}
