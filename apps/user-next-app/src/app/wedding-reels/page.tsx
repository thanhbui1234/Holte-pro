import { generateMetadata } from "@/app/metadata";
import { WeddingReelsPage } from "./WeddingReelsPage";
import { getAppSections } from "@/lib/video.api";
import { findSection, mapReelSectionToReels } from "@/lib/video.mapper";
import type { WeddingReelsSectionData } from "@/types/video.types";

export const metadata = generateMetadata({
  title: "Wedding Reels",
  description:
    "Short-form wedding reels crafted for social media sharing — TikTok, Instagram Reels & Facebook. JOW Film, Vietnam.",
  canonical: "/wedding-reels",
  keywords: [
    "wedding reels",
    "wedding short film",
    "TikTok wedding",
    "Instagram reels wedding",
    "JOW Film reels",
  ],
});

export default async function Page() {
  const sections = await getAppSections();

  const reelsData = findSection<WeddingReelsSectionData>(
    sections,
    "wedding-reels",
  );
  const reels = reelsData ? mapReelSectionToReels(reelsData) : undefined;

  return <WeddingReelsPage reels={reels} />;
}
