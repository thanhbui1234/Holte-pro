import { Button } from "shared-ui";
import { ArrowRight } from "lucide-react";

/**
 * CTASection Component
 *
 * Final call-to-action section at the bottom of the home page.
 * Encourages users to start a free trial.
 *
 * @section CTA - Last section on the home page
 */
export function CTASection() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Main headline */}
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Get Started?
        </h2>

        {/* Subheadline */}
        <p className="text-muted-foreground text-lg">
          Join thousands of developers building with Holte today.
        </p>

        {/* CTA Button */}
        <Button size="lg" className="text-base">
          Start Free Trial
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
}
