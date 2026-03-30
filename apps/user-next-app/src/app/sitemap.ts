import type { MetadataRoute } from "next";
import { SEO_CONFIG } from "./metadata";

/**
 * Sitemap Generator
 *
 * Next.js App Router convention — automatically served at `/sitemap.xml`.
 * Add new routes here as the application grows.
 *
 * Priority guide:
 *   1.0 = Homepage
 *   0.8 = Key landing pages
 *   0.6 = Secondary pages
 *   0.4 = Blog / dynamic content
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SEO_CONFIG.SITE_URL;
  const now = new Date();

  // Static routes — add more as pages are created
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // TODO: Fetch dynamic routes (e.g. blog posts) from CMS/database
  // const blogPosts = await fetchBlogPosts();
  // const dynamicRoutes = blogPosts.map((post) => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: "monthly" as const,
  //   priority: 0.6,
  // }));

  return [...staticRoutes];
}
