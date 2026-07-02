import type { Metadata } from "next";
import { generateSEO } from "@/app/metadata";
import { ContactPage } from "./ContactPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateSEO({
    title: "Contact Us",
    description:
      "Get in touch with JOW Film — tell us about your wedding day and we'll craft a cinematic story that lasts forever.",
    canonical: "/contact",
    keywords: [
      "contact JOW Film",
      "wedding film booking",
      "liên hệ quay phim cưới",
      "đặt lịch quay phim cưới",
    ],
  });
}

export default function Page() {
  return <ContactPage />;
}
