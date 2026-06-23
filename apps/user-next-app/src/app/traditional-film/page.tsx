import { notFound } from "next/navigation";
import { generateMetadata } from "@/app/metadata";
import { TraditionalFilmPage } from "./TraditionalFilmPage";
import { getAppSections } from "@/lib/video.api";
import {
  findSection,
  mapTraditionalFilmSectionToFilms,
} from "@/lib/video.mapper";
import type { TraditionalFilmsSectionData } from "@/types/video.types";

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
  const sections = await getAppSections();

  const filmData = findSection<TraditionalFilmsSectionData>(
    sections,
    "traditional-films",
  );
  
  // If the section is inactive or missing, return a 404
  if (!filmData) {
    notFound();
  }

  const films = mapTraditionalFilmSectionToFilms(filmData);

  return <TraditionalFilmPage films={films} config={filmData.config} />;
}
