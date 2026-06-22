import { generateMetadata } from "@/app/metadata";
import { WeddingReelsPage } from "./WeddingReelsPage";
import { getAppVideoList } from "@/lib/video.api";
import { mapToReelItem } from "@/lib/video.mapper";
import { VideoCategory } from "@/types/video.types";

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
  const videos = await getAppVideoList({
    categoryIds: [VideoCategory.ENGAGEMENT],
    statuses: ["UPLOADED"],
  });

  const reels = videos.length > 0 ? videos.map(mapToReelItem) : undefined;

  return <WeddingReelsPage reels={reels} />;
}
