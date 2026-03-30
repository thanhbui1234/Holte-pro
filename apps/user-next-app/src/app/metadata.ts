import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// SEO Config — single source of truth for all SEO-related constants
// Update these values when deploying to production.
// ---------------------------------------------------------------------------
export const SEO_CONFIG = {
  SITE_URL: "https://holte-platform.com",
  SITE_NAME: "Holte Platform",
  TWITTER_HANDLE: "@holteplatform",
  LOGO_URL: "https://holte-platform.com/logo.png",
  DEFAULT_OG_IMAGE: "/og-image.png",
  DEFAULT_DESCRIPTION:
    "A modern, scalable platform built for developers and businesses. Experience seamless integration, powerful features, and exceptional performance.",
  SUPPORTED_LOCALES: {
    "en-US": "en",
    "vi-VN": "vi",
  } as Record<string, string>,
} as const;

// ---------------------------------------------------------------------------
// MetadataOptions
// ---------------------------------------------------------------------------
interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  openGraphImage?: string;
  /** Set to false to prevent indexing (e.g. staging, private pages) */
  noIndex?: boolean;
}

/**
 * generateMetadata
 *
 * Reusable function to generate Next.js Metadata for any page.
 * Provides sensible defaults with per-page overrides.
 *
 * @example
 * ```ts
 * export const metadata = generateMetadata({
 *   title: "Features",
 *   description: "Explore our powerful features...",
 *   canonical: "/features",
 * });
 * ```
 */
export function generateMetadata({
  title = SEO_CONFIG.SITE_NAME,
  description = SEO_CONFIG.DEFAULT_DESCRIPTION,
  keywords = [
    "developer platform",
    "cloud deployment",
    "scalable applications",
    "modern development",
    "enterprise solution",
  ],
  canonical = "/",
  openGraphImage = SEO_CONFIG.DEFAULT_OG_IMAGE,
  noIndex = false,
}: MetadataOptions = {}): Metadata {
  const canonicalUrl = `${SEO_CONFIG.SITE_URL}${canonical}`;

  return {
    metadataBase: new URL(SEO_CONFIG.SITE_URL),
    title: {
      default: title,
      template: `%s | ${SEO_CONFIG.SITE_NAME}`,
    },
    description,
    keywords,
    authors: [{ name: "Holte Team" }],
    creator: "Holte Team",
    publisher: "Holte",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    // Canonical URL + hreflang for multi-language (PRO)
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": `${SEO_CONFIG.SITE_URL}/en${canonical}`,
        "vi-VN": `${SEO_CONFIG.SITE_URL}/vi${canonical}`,
      },
    },
    // Open Graph / Facebook
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: SEO_CONFIG.SITE_NAME,
      images: [
        {
          url: openGraphImage,
          width: 1200,
          height: 630,
          alt: SEO_CONFIG.SITE_NAME,
        },
      ],
    },
    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [openGraphImage],
      creator: SEO_CONFIG.TWITTER_HANDLE,
    },
    // Robots
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
  };
}

// ---------------------------------------------------------------------------
// Structured Data (JSON-LD) Generators
// @see https://schema.org/
// ---------------------------------------------------------------------------

/**
 * Organization schema
 * Used in root layout to identify the company behind the website.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SEO_CONFIG.SITE_NAME,
    url: SEO_CONFIG.SITE_URL,
    logo: SEO_CONFIG.LOGO_URL,
    description: SEO_CONFIG.DEFAULT_DESCRIPTION,
    sameAs: [
      `https://twitter.com/${SEO_CONFIG.TWITTER_HANDLE.replace("@", "")}`,
      "https://github.com/holte-platform",
      "https://linkedin.com/company/holte-platform",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@holte-platform.com",
    },
  };
}

/**
 * WebSite schema
 * Enables Google's Sitelinks Searchbox and identifies the site.
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SEO_CONFIG.SITE_NAME,
    url: SEO_CONFIG.SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SEO_CONFIG.SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList schema
// ---------------------------------------------------------------------------
interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * getBreadcrumbSchema
 *
 * Generates a BreadcrumbList schema from a dynamic array of items.
 * Home is always prepended automatically.
 *
 * @example
 * ```ts
 * getBreadcrumbSchema([
 *   { name: "Blog", url: "/blog" },
 *   { name: "My Post", url: "/blog/my-post" },
 * ])
 * ```
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[] = []) {
  const allItems = [
    { name: "Home", url: SEO_CONFIG.SITE_URL },
    ...items.map((item) => ({
      ...item,
      url: item.url.startsWith("http")
        ? item.url
        : `${SEO_CONFIG.SITE_URL}${item.url}`,
    })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ---------------------------------------------------------------------------
// FAQ schema (SHOULD HAVE)
// ---------------------------------------------------------------------------
interface FAQItem {
  question: string;
  answer: string;
}

/**
 * getFAQSchema
 *
 * Generates a FAQPage schema for rich results (expandable FAQ in SERPs).
 *
 * @example
 * ```ts
 * getFAQSchema([
 *   { question: "What is Holte?", answer: "A modern platform..." },
 * ])
 * ```
 */
export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// Product schema (MUST HAVE — PRO)
// ---------------------------------------------------------------------------
interface ProductSchemaOptions {
  name: string;
  description: string;
  image: string;
  url: string;
  ratingValue?: number;
  reviewCount?: number;
  priceCurrency?: string;
  price?: string;
  priceValidUntil?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}

/**
 * getProductSchema
 *
 * Generates a Product schema for ecommerce or SaaS product pages.
 * Enables price, rating, and availability rich results.
 */
export function getProductSchema({
  name,
  description,
  image,
  url,
  ratingValue = 4.8,
  reviewCount = 124,
  priceCurrency = "USD",
  price = "0",
  priceValidUntil = "2026-12-31",
  availability = "InStock",
}: ProductSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: url.startsWith("http") ? url : `${SEO_CONFIG.SITE_URL}${url}`,
    brand: {
      "@type": "Brand",
      name: SEO_CONFIG.SITE_NAME,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency,
      price,
      priceValidUntil,
      availability: `https://schema.org/${availability}`,
      url: url.startsWith("http") ? url : `${SEO_CONFIG.SITE_URL}${url}`,
    },
  };
}

// ---------------------------------------------------------------------------
// Blog / Article schema (SHOULD HAVE)
// ---------------------------------------------------------------------------
interface BlogPostSchemaOptions {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
}

/**
 * getBlogPostSchema
 *
 * Generates an Article schema for blog posts.
 * Enables Google's article rich results (headline, image, date).
 */
export function getBlogPostSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName,
}: BlogPostSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image,
    url: url.startsWith("http") ? url : `${SEO_CONFIG.SITE_URL}${url}`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SEO_CONFIG.SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: SEO_CONFIG.LOGO_URL,
      },
    },
  };
}
