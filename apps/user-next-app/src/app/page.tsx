import dynamic from "next/dynamic";
import { AboutSection } from "@/components/sections/AboutSection";
import { generateMetadata } from "./metadata";
import { VideoBanner } from "@/components/ui/VideoBanner";
import { ContactPreview } from "@/components/sections/ContactPreview";
import { getAppVideoList } from "@/lib/video.api";
import { mapToHighlightVideo, mapToReelItem } from "@/lib/video.mapper";
import { VideoCategory } from "@/types/video.types";

const WeddingHighlightSection = dynamic(
  () => import("@/components/sections/WeddingHighlightSection").then((m) => m.WeddingHighlightSection),
  { ssr: true }
);
const WeddingReelsSection = dynamic(
  () => import("@/components/sections/WeddingReelsSection").then((m) => m.WeddingReelsSection),
  { ssr: true }
);

export const metadata = generateMetadata({
  title: "JOW Film",
  description:
    "JOW Film — A cinematic wedding film studio. Discover our portfolio of timeless love stories.",
  canonical: "/",
});

export default async function Home() {
  const videos = await getAppVideoList({
    statuses: ["UPLOADED"],
  });
  console.log("videos", videos);

  const highlightVideos = videos.filter(v => v.categoryId === VideoCategory.WEDDING);
  const reelVideos = videos.filter(v => v.categoryId === VideoCategory.ENGAGEMENT);

  const highlights = highlightVideos.length > 0 ? highlightVideos.map(mapToHighlightVideo) : undefined;
  const reels = reelVideos.length > 0 ? reelVideos.map(mapToReelItem) : undefined;

  console.log("highlights", highlights);
  console.log("reels", reels);
  console.log('videos', videos);
  return (
    <main>
      <VideoBanner />
      <AboutSection />
      <WeddingHighlightSection videos={highlights} />
      <WeddingReelsSection reels={reels} />
      <ContactPreview />
    </main>
  );
}
