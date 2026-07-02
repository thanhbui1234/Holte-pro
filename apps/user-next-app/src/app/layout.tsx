import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  getOrganizationSchema,
  getWebsiteSchema,
  generateSEO,
  SEO_CONFIG,
} from "./metadata";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0c0c0c" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  return generateSEO();
}

const SiteStructuredData = () => {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [getOrganizationSchema(), getWebsiteSchema()],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAppSections } from "@/lib/video.api";
import type { HeaderSectionData, FooterSectionData } from "@/types/video.types";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sections = await getAppSections();
  const activeSections = sections
    .filter((s) => s.status === "ACTIVE")
    .map((s) => s.name);

  const headerSection = sections.find((s) => s.name === "header");
  const headerData = headerSection?.data?.map as HeaderSectionData | undefined;

  const footerSection = sections.find((s) => s.name === "footer");
  const footerData = footerSection?.data?.map as FooterSectionData | undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <SiteStructuredData />
      </head>
      <body>
        <Providers>
          <Header activeSections={activeSections} headerData={headerData} />
          {children}
          <Footer footerData={footerData} />
        </Providers>
      </body>
    </html>
  );
}
