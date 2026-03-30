import { Shield, Zap, Globe, Users, Star } from "lucide-react";

/**
 * FeatureCard Component
 *
 * A single feature card displaying an icon, title, and description.
 * Includes hover effects for better interactivity.
 *
 * @interface FeatureCardProps - Props for the feature card
 * @property {React.ElementType} icon - Lucide icon component to display
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 */
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group p-6 rounded-lg border bg-card hover:shadow-lg transition-all duration-300">
      {/* Icon container with hover effect */}
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>

      {/* Description */}
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

/**
 * FeaturesGrid Component
 *
 * Displays a grid of feature cards showcasing platform capabilities.
 * Responsive layout: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
 *
 * @section Features - Second section on the home page
 */
export function FeaturesGrid() {
  // Feature data array - easy to extend or modify
  const features = [
    {
      icon: Shield,
      title: "Secure by Default",
      description:
        "Enterprise-grade security with built-in protection against common vulnerabilities.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Optimized performance with edge caching and automatic code splitting.",
    },
    {
      icon: Globe,
      title: "Global Scale",
      description:
        "Deploy worldwide with automatic CDN distribution and low-latency routing.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Built-in collaboration tools for teams of all sizes with real-time sync.",
    },
    {
      icon: Star,
      title: "Premium Support",
      description:
        "24/7 dedicated support from our expert team whenever you need help.",
    },
    {
      icon: Shield,
      title: "Easy Integration",
      description:
        "Seamlessly connect with your existing tools and workflows via APIs.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-24">
      {/* Section header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Powerful Features
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Everything you need to build and scale your applications
        </p>
      </div>

      {/* Feature cards grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
}
