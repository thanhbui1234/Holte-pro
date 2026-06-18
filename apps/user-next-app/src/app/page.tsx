import dynamic from "next/dynamic";
import { AboutSection } from "@/components/sections/AboutSection";
import { generateMetadata } from "./metadata";
import { VideoBanner } from "@/components/ui/VideoBanner";
import { CustomSectionRenderer } from "@/components/sections/custom/CustomSectionRenderer";
import { CUSTOM_SECTIONS } from "@/data/custom-sections";

const WeddingHighlightSection = dynamic(
  () => import("@/components/sections/WeddingHighlightSection").then((m) => m.WeddingHighlightSection),
  { ssr: true }
);
const WeddingReelsSection = dynamic(
  () => import("@/components/sections/WeddingReelsSection").then((m) => m.WeddingReelsSection),
  { ssr: true }
);
const ContactPreview = dynamic(
  () => import("@/components/sections/ContactPreview").then((m) => m.ContactPreview),
  { ssr: true }
);

export const metadata = generateMetadata({
  title: "JOW Film",
  description:
    "JOW Film — A cinematic wedding film studio. Discover our portfolio of timeless love stories.",
  canonical: "/",
});

export default function Home() {
  return (
    <main>
      <VideoBanner />
      <AboutSection />
      <WeddingHighlightSection />
      <WeddingReelsSection />
      {/* {CUSTOM_SECTIONS.map((section) => (
        <CustomSectionRenderer key={section.id} section={section} />
      ))} */}
      <ContactPreview />
    </main>
  );
}
