import { generateMetadata } from "@/app/metadata";
import { TraditionalFilmPage } from "./TraditionalFilmPage";
import { getAppVideoList } from "@/lib/video.api";
import { mapToFilmItem } from "@/lib/video.mapper";
import { VideoCategory } from "@/types/video.types";

export const metadata = generateMetadata({
  title: "Traditional Films",
  description:
    "Full-length traditional wedding films capturing every moment — from morning preparations to the final farewell. JOW Film, Vietnam.",
  canonical: "/traditional-film",
  keywords: [
    "traditional wedding film",
    "phim cưới truyền thống",
    "full wedding film",
    "JOW Film traditional",
    "lễ gia tiên",
  ],
});

export default async function Page() {
  const videos = await getAppVideoList({
    categoryIds: [VideoCategory.FUNERAL],
    statuses: ["UPLOADED"],
  });

  const films = videos.length > 0 ? videos.map(mapToFilmItem) : undefined;

  return <TraditionalFilmPage films={films} />;
}
