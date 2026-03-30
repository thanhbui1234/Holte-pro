import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "./metadata";

/**
 * Robots.txt Generator
 *
 * Next.js App Router convention — automatically served at `/robots.txt`.
 * Controls which paths search engine crawlers are allowed to access.
 *
 * Rules:
 * - Allow all public pages
 * - Disallow internal API routes, admin, and private paths
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/private/",
          "/*.json$", // Prevent crawling of raw JSON endpoints
        ],
      },
      // Block specific bots that ignore standard rules
      {
        userAgent: "GPTBot",
        disallow: ["/"],
      },
    ],
    sitemap: `${SEO_CONFIG.SITE_URL}/sitemap.xml`,
    host: SEO_CONFIG.SITE_URL,
  };
}
