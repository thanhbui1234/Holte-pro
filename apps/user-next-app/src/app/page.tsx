import dynamic from "next/dynamic";
import { AboutSection } from "@/components/sections/AboutSection";
import { generateSEO } from "./metadata";
import type { Metadata } from "next";
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

export async function generateMetadata(): Promise<Metadata> {
  return generateSEO({
    title: "JOW Film",
    description:
      "JOW Film — A cinematic wedding film studio. Discover our portfolio of timeless love stories.",
    canonical: "/",
  });
}

export default async function Home() {
  const sections = await getAppSections();

  // Pre-extract FIXED section data
  const bannerData = findSection<BannerSectionData>(sections, "banner");
  console.log('bannerData', bannerData)
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
                mobileVideo={bannerData.mobileVideo}
                logoSrc={bannerData.logoSrc}
              />
            ) : null;

          case "about":
            return aboutData ? (
              <AboutSection
                key={section.id}
                eyebrow={aboutData.eyebrow}
                eyebrowColor={aboutData.eyebrowColor}
                titlePrefix={aboutData.titlePrefix}
                titlePrefixColor={aboutData.titlePrefixColor}
                titleHighlight={aboutData.titleHighlight}
                titleHighlightColor={aboutData.titleHighlightColor}
                descriptionEn={aboutData.descriptionEn}
                descriptionEnColor={aboutData.descriptionEnColor}
                descriptionVi={aboutData.descriptionVi}
                descriptionViColor={aboutData.descriptionViColor}
                pillars={aboutData.pillars}
                legacyLabel={aboutData.legacyLabel}
                backgroundColor={aboutData.backgroundColor}
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
                eyebrowColor={highlightData.config?.eyebrowColor}
                titlePrefix={highlightData.config?.titlePrefix}
                titlePrefixColor={highlightData.config?.titlePrefixColor}
                titleHighlight={highlightData.config?.titleHighlight}
                titleHighlightColor={highlightData.config?.titleHighlightColor}
                description={highlightData.config?.description}
                descriptionColor={highlightData.config?.descriptionColor}
              />
            ) : null;

          case "wedding-reels":
            return reelsData ? (
              <WeddingReelsSection
                key={section.id}
                reels={reels}
                backgroundColor={reelsData.config?.backgroundColor}
                eyebrow={reelsData.config?.eyebrow}
                eyebrowColor={reelsData.config?.eyebrowColor}
                titlePrefix={reelsData.config?.titlePrefix}
                titlePrefixColor={reelsData.config?.titlePrefixColor}
                titleHighlight={reelsData.config?.titleHighlight}
                titleHighlightColor={reelsData.config?.titleHighlightColor}
                description={reelsData.config?.description}
                descriptionColor={reelsData.config?.descriptionColor}
              />
            ) : null;

          case "traditional-films":
            return traditionalData ? (
              <TraditionalFilmSection
                key={section.id}
                films={traditionalFilms}
                backgroundColor={traditionalData.config?.backgroundColor}
                eyebrow={traditionalData.config?.eyebrow}
                eyebrowColor={traditionalData.config?.eyebrowColor}
                titlePrefix={traditionalData.config?.titlePrefix}
                titlePrefixColor={traditionalData.config?.titlePrefixColor}
                titleHighlight={traditionalData.config?.titleHighlight}
                titleHighlightColor={traditionalData.config?.titleHighlightColor}
                description={traditionalData.config?.description}
                descriptionColor={traditionalData.config?.descriptionColor}
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
                eyebrowColor={contactData.eyebrowColor}
                titleColor={contactData.titleColor}
                highlightColor={contactData.highlightColor}
                descriptionColor={contactData.descriptionColor}
                buttonBgColor={contactData.buttonBgColor}
                buttonTextColor={contactData.buttonTextColor}
              />
            ) : null;

          default:
            return null;
        }
      })}
    </main>
  );
}
