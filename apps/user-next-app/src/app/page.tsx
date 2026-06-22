import dynamic from "next/dynamic";
import { AboutSection } from "@/components/sections/AboutSection";
import { generateMetadata } from "./metadata";
import { VideoBanner } from "@/components/ui/VideoBanner";
import { ContactPreview } from "@/components/sections/ContactPreview";
import { getAppSections } from "@/lib/video.api";
import {
  findSection,
  findCustomSections,
  mapHighlightSectionToVideos,
  mapReelSectionToReels,
} from "@/lib/video.mapper";
import { CustomSectionRenderer } from "@/components/sections/custom/CustomSectionRenderer";
import type {
  BannerSectionData,
  AboutSectionData,
  WeddingHighlightsSectionData,
  WeddingReelsSectionData,
} from "@/types/video.types";

const WeddingHighlightSection = dynamic(
  () =>
    import("@/components/sections/WeddingHighlightSection").then(
      (m) => m.WeddingHighlightSection,
    ),
  { ssr: true },
);
const WeddingReelsSection = dynamic(
  () =>
    import("@/components/sections/WeddingReelsSection").then(
      (m) => m.WeddingReelsSection,
    ),
  { ssr: true },
);

export const metadata = generateMetadata({
  title: "JOW Film",
  description:
    "JOW Film — A cinematic wedding film studio. Discover our portfolio of timeless love stories.",
  canonical: "/",
});

export default async function Home() {
  const sections = await getAppSections();
  console.log("sections", sections);
  // ── Banner ──────────────────────────────────────────────────────────────────
  const bannerData = findSection<BannerSectionData>(sections, "banner");

  // ── About ────────────────────────────────────────────────────────────────────
  const aboutData = findSection<AboutSectionData>(sections, "about");

  // ── Wedding Highlights ───────────────────────────────────────────────────────
  const highlightData = findSection<WeddingHighlightsSectionData>(
    sections,
    "wedding-highlights",
  );
  const highlights = highlightData
    ? mapHighlightSectionToVideos(highlightData)
    : undefined;
  console.log('highlights', highlights)
  // ── Wedding Reels ────────────────────────────────────────────────────────────
  const reelsData = findSection<WeddingReelsSectionData>(
    sections,
    "wedding-reels",
  );
  const reels = reelsData ? mapReelSectionToReels(reelsData) : undefined;

  // ── Custom Sections ──────────────────────────────────────────────────────────
  const customSections = findCustomSections(sections);

  return (
    <main>
      <VideoBanner
        videoSrc={bannerData?.videoSrc}
        logoSrc={bannerData?.logoSrc}
      />
      <AboutSection
        eyebrow={aboutData?.eyebrow}
        titlePrefix={aboutData?.titlePrefix}
        titleHighlight={aboutData?.titleHighlight}
        descriptionEn={aboutData?.descriptionEn}
        descriptionVi={aboutData?.descriptionVi}
        pillars={aboutData?.pillars}
        legacyLabel={aboutData?.legacyLabel}
        stats={aboutData?.stats}
        images={aboutData?.images?.map((img) => ({ src: img.src, label: img.description }))}
      />
      <WeddingHighlightSection videos={highlights} />
      <WeddingReelsSection reels={reels} />
      {customSections.map((section) => (
        <CustomSectionRenderer key={section.id} section={section} />
      ))}
      <ContactPreview />
    </main>
  );
}
