import { Star } from "lucide-react";

/**
 * TestimonialCard Component
 *
 * Displays a single user testimonial with star rating, quote, and author info.
 *
 * @interface TestimonialCardProps - Props for the testimonial card
 * @property {string} quote - The testimonial quote text
 * @property {string} author - Name of the person giving the testimonial
 * @property {string} role - Job title/role of the person
 */
interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <div className="p-6 rounded-lg bg-card border shadow-sm">
      {/* Star rating (5 stars) */}
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>

      {/* Testimonial quote */}
      <p className="text-muted-foreground mb-6 italic">"{quote}"</p>

      {/* Author information */}
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

/**
 * Testimonials Section Component
 *
 * Displays a grid of user testimonials as social proof.
 * Responsive layout: 1 column (mobile) → 3 columns (desktop)
 *
 * @section Testimonials - Third section on the home page
 */
export function TestimonialsSection() {
  // Testimonial data array - easy to extend or modify
  const testimonials = [
    {
      quote:
        "Holte has transformed how we build and deploy applications. The performance gains are incredible.",
      author: "Sarah Chen",
      role: "CTO at TechStart",
    },
    {
      quote:
        "The best developer experience I've had in years. Everything just works seamlessly.",
      author: "Michael Rodriguez",
      role: "Lead Developer",
    },
    {
      quote:
        "Our team productivity increased by 40% after switching to Holte. Highly recommended!",
      author: "Emily Watson",
      role: "Engineering Manager",
    },
  ];

  return (
    <section className="bg-muted/50 py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Users
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See what our community has to say
          </p>
        </div>

        {/* Testimonial cards grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
