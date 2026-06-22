import { generateMetadata } from "@/app/metadata";
import { WeddingHighlightPage } from "./WeddingHighlightPage";
import { getAppVideoList } from "@/lib/video.api";
import { mapToHighlightVideo } from "@/lib/video.mapper";
import { VideoCategory } from "@/types/video.types";

export const metadata = generateMetadata({
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

export default async function Page() {
  const videos = await getAppVideoList({
    categoryIds: [VideoCategory.WEDDING],
    statuses: ["UPLOADED"],
  });

  const highlights = videos.length > 0 ? videos.map(mapToHighlightVideo) : undefined;

  return <WeddingHighlightPage videos={highlights} />;
}
