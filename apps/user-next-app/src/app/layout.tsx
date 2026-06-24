import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  getOrganizationSchema,
  getWebsiteSchema,
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

export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.SITE_URL),
  title: {
    default: SEO_CONFIG.SITE_NAME,
    template: `%s | ${SEO_CONFIG.SITE_NAME}`,
  },
  description: SEO_CONFIG.DEFAULT_DESCRIPTION,
  keywords: [
    "wedding film",
    "wedding cinematography",
    "wedding highlights",
    "traditional films",
    "wedding reels Vietnams",
    "JOW Film",
    "phim cưới",
  ],
  authors: [{ name: "JOW Film" }],
  creator: "JOW Film",
  publisher: "JOW Film",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SEO_CONFIG.SITE_URL,
    siteName: SEO_CONFIG.SITE_NAME,
    images: [
      {
        url: SEO_CONFIG.DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SEO_CONFIG.SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SEO_CONFIG.SITE_NAME} – Cinematic Wedding Films`,
    description: SEO_CONFIG.DEFAULT_DESCRIPTION,
    images: [SEO_CONFIG.DEFAULT_OG_IMAGE],
    creator: SEO_CONFIG.TWITTER_HANDLE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {},
};

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
