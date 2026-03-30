import {
  HeroSection,
  FeaturesGrid,
  TestimonialsSection,
  CTASection,
} from "@/components";
import { generateMetadata, getBreadcrumbSchema, getFAQSchema } from "./metadata";

/**
 * Home Page
 *
 * Landing page composed of modular sections.
 * Includes page-level structured data (Breadcrumb + FAQ) via inline JSON-LD.
 *
 * Sections:
 * 1. HeroSection       — Welcome banner with CTAs
 * 2. FeaturesGrid      — Platform features showcase
 * 3. TestimonialsSection — Social proof
 * 4. CTASection        — Final call-to-action
 */

// Page-specific SEO metadata
export const metadata = generateMetadata({
  title: "Home – Welcome to Holte Platform",
  description:
    "Discover Holte Platform – a modern, scalable solution for developers and businesses. Build, deploy, and scale applications with ease.",
  keywords: [
    "holte platform",
    "home page",
    "developer tools",
    "cloud platform",
    "application deployment",
  ],
  canonical: "/",
});

// ---------------------------------------------------------------------------
// Sample FAQ data — replace with real content or fetch from CMS
// ---------------------------------------------------------------------------
const HOME_FAQS = [
  {
    question: "What is Holte Platform?",
    answer:
      "Holte Platform is a modern, scalable developer platform that helps teams build, deploy, and scale applications with seamless integration and exceptional performance.",
  },
  {
    question: "Is Holte Platform free to use?",
    answer:
      "Yes, Holte Platform offers a free tier with generous limits. Paid plans are available for teams and enterprises that need advanced features and higher usage limits.",
  },
  {
    question: "What technologies does Holte Platform support?",
    answer:
      "Holte Platform supports all major languages and frameworks including Node.js, Python, Go, Java, and more. It integrates with popular CI/CD tools and cloud providers.",
  },
  {
    question: "How can I get started?",
    answer:
      "You can sign up for a free account on our website, follow the quick-start guide, and deploy your first application in minutes. No credit card required.",
  },
];

// ---------------------------------------------------------------------------
// Page-level Structured Data — Breadcrumb + FAQ
// ---------------------------------------------------------------------------
const HomeStructuredData = () => {
  // Home breadcrumb is just the root — items array is empty (Home is prepended automatically)
  const breadcrumb = getBreadcrumbSchema([]);
  const faq = getFAQSchema(HOME_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Page-level structured data: Breadcrumb + FAQ */}
      <HomeStructuredData />

      {/* Section 1: Hero – Main welcome banner */}
      <HeroSection />

      {/* Section 2: Features – Platform capabilities */}
      <FeaturesGrid />

      {/* Section 3: Testimonials – Social proof */}
      <TestimonialsSection />

      {/* Section 4: CTA – Final conversion prompt */}
      <CTASection />
    </div>
  );
}
