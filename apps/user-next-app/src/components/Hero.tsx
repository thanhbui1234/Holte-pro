import { Button } from "shared-ui";
import { ArrowRight } from "lucide-react";

/**
 * HeroSection Component
 *
 * The main hero banner at the top of the home page.
 * Features a gradient background, headline, subheadline, and CTA buttons.
 *
 * @section Hero - First visible section on the page
 */
export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

      <div className="relative container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to{" "}
            <span className="text-primary">Holte Platform</span>
          </h1>

          {/* Subheadline / Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, scalable platform built for developers and businesses.
            Experience seamless integration, powerful features, and exceptional
            performance.
          </p>

          {/* Call-to-action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="text-base">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
