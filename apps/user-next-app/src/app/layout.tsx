import type { Metadata } from "next";
import "./globals.css";
import {
  getOrganizationSchema,
  getWebsiteSchema,
  SEO_CONFIG,
} from "./metadata";

/**
 * Root Layout
 *
 * Wraps all pages. Injects:
 * - Global SEO metadata (title template, description, robots)
 * - JSON-LD: Organization + WebSite via @graph (single <script> tag)
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout
 */

// Default metadata for pages that don't export their own
export const metadata: Metadata = {
  metadataBase: new URL(SEO_CONFIG.SITE_URL),
  title: {
    default: SEO_CONFIG.SITE_NAME,
    template: `%s | ${SEO_CONFIG.SITE_NAME}`,
  },
  description: SEO_CONFIG.DEFAULT_DESCRIPTION,
  keywords: [
    "developer platform",
    "cloud deployment",
    "scalable applications",
    "modern development",
    "enterprise solution",
    "API integration",
    "team collaboration",
  ],
  authors: [{ name: "Holte Team" }],
  creator: "Holte Team",
  publisher: "Holte",
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
    title: `${SEO_CONFIG.SITE_NAME} – Modern Development Platform`,
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
  // Add your verification codes from Google Search Console, Bing, etc.
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    other: {
      "msvalidate.01": "your-bing-verification-code",
    },
  },
};

/**
 * SiteStructuredData
 *
 * Injects Organization + WebSite JSON-LD in a single <script> tag using
 * @graph — best practice per Google's documentation.
 *
 * Placed in <head> of root layout so it applies to every page.
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/guides/intro-structured-data
 */
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

/**
 * RootLayout
 *
 * Required Next.js App Router layout. Must include <html> and <body>.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Site-level structured data: Organization + WebSite */}
        <SiteStructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
