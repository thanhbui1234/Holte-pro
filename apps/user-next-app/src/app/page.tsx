import dynamic from "next/dynamic";
import { AboutSection } from "@/components/sections/AboutSection";
import { generateMetadata } from "./metadata";
import { VideoBanner } from "@/components/ui/VideoBanner";
import { ContactPreview } from "@/components/sections/ContactPreview";
import { getAppSections } from "@/lib/video.api";
import {
  findSection,
  mapCustomSection,
  mapHighlightSectionToVideos,
  mapReelSectionToReels,
  mapTraditionalFilmSectionToFilms,
} from "@/lib/video.mapper";
import { CustomSectionRenderer } from "@/components/sections/custom/CustomSectionRenderer";
import type {
  BannerSectionData,
  AboutSectionData,
  WeddingHighlightsSectionData,
  WeddingReelsSectionData,
  TraditionalFilmsSectionData,
  ContactCtaSectionData,
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
const TraditionalFilmSection = dynamic(
  () =>
    import("@/components/sections/TraditionalFilmSection").then(
      (m) => m.TraditionalFilmSection,
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

  // Pre-extract FIXED section data
  const bannerData = findSection<BannerSectionData>(sections, "banner");
  const aboutData = findSection<AboutSectionData>(sections, "about");
  const highlightData = findSection<WeddingHighlightsSectionData>(sections, "wedding-highlights");
  const reelsData = findSection<WeddingReelsSectionData>(sections, "wedding-reels");
  const traditionalData = findSection<TraditionalFilmsSectionData>(sections, "traditional-films");
  const contactData = findSection<ContactCtaSectionData>(sections, "contact-cta");

  const highlights = highlightData ? mapHighlightSectionToVideos(highlightData) : undefined;
  const reels = reelsData ? mapReelSectionToReels(reelsData) : undefined;
  const traditionalFilms = traditionalData ? mapTraditionalFilmSectionToFilms(traditionalData) : undefined;

  // Render ALL active sections in displayOrder — CUSTOM via canvas, FIXED via their component
  const orderedSections = [...sections]
    .filter((s) => s.status === "ACTIVE")
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <main>
      {orderedSections.map((section) => {
        if (section.type === "CUSTOM") {
          if (section.data.empty) return null;
          return (
            <CustomSectionRenderer
              key={section.id}
              section={mapCustomSection(section)}
            />
          );
        }

        // FIXED — dispatch by name
        switch (section.name) {
          case "banner":
            return bannerData ? (
              <VideoBanner
                key={section.id}
                videoSrc={bannerData.videoSrc}
                logoSrc={bannerData.logoSrc}
              />
            ) : null;

          case "about":
            return aboutData ? (
              <AboutSection
                key={section.id}
                eyebrow={aboutData.eyebrow}
                titlePrefix={aboutData.titlePrefix}
                titleHighlight={aboutData.titleHighlight}
                descriptionEn={aboutData.descriptionEn}
                descriptionVi={aboutData.descriptionVi}
                pillars={aboutData.pillars}
                legacyLabel={aboutData.legacyLabel}
                stats={aboutData.stats}
                images={aboutData.images?.map((img) => ({ src: img.src, label: img.description }))}
              />
            ) : null;

          case "wedding-highlights":
            return highlightData ? (
              <WeddingHighlightSection
                key={section.id}
                videos={highlights}
                backgroundColor={highlightData.config?.backgroundColor}
                eyebrow={highlightData.config?.eyebrow}
                titlePrefix={highlightData.config?.titlePrefix}
                titleHighlight={highlightData.config?.titleHighlight}
                description={highlightData.config?.description}
              />
            ) : null;

          case "wedding-reels":
            return reelsData ? (
              <WeddingReelsSection
                key={section.id}
                reels={reels}
                backgroundColor={reelsData.config?.backgroundColor}
                eyebrow={reelsData.config?.eyebrow}
                titlePrefix={reelsData.config?.titlePrefix}
                titleHighlight={reelsData.config?.titleHighlight}
                description={reelsData.config?.description}
              />
            ) : null;

          case "traditional-films":
            return traditionalData ? (
              <TraditionalFilmSection
                key={section.id}
                films={traditionalFilms}
                backgroundColor={traditionalData.config?.backgroundColor}
                eyebrow={traditionalData.config?.eyebrow}
                titlePrefix={traditionalData.config?.titlePrefix}
                titleHighlight={traditionalData.config?.titleHighlight}
                description={traditionalData.config?.description}
              />
            ) : null;

          case "contact-cta":
            return contactData ? (
              <ContactPreview
                key={section.id}
                eyebrow={contactData.eyebrow}
                titlePrefix={contactData.titlePrefix}
                titleHighlight={contactData.titleHighlight}
                description={contactData.description}
                ctaLabel={contactData.ctaLabel}
                ctaHref={contactData.ctaHref}
                backgroundColor={contactData.backgroundColor}
              />
            ) : null;

          default:
            return null;
        }
      })}
    </main>
  );
}
