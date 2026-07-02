import type { Metadata } from "next";
import { generateSEO } from "@/app/metadata";
import { WeddingHighlightPage } from "./WeddingHighlightPage";
import { getAppSections } from "@/lib/video.api";
import { findSection, mapHighlightSectionToVideos } from "@/lib/video.mapper";
import type { WeddingHighlightsSectionData } from "@/types/video.types";

export async function generateMetadata(): Promise<Metadata> {
  return generateSEO({
    title: "Wedding Highlights",
    description:
      "Watch our cinematic wedding highlight films — your love story distilled into a 3–5 minute masterpiece. JOW Film, Vietnam.",
    canonical: "/wedding-highlight",
    keywords: [
      "wedding highlight",
      "wedding highlight film",
      "phim cưới highlight",
      "JOW Film highlight",
      "cinematic wedding",
    ],
  });
}

export default async function Page() {
  const sections = await getAppSections();

  const highlightData = findSection<WeddingHighlightsSectionData>(
    sections,
    "wedding-highlights",
  );
  const highlights = highlightData
    ? mapHighlightSectionToVideos(highlightData)
    : undefined;

  return <WeddingHighlightPage videos={highlights} config={highlightData?.config} />;
}
