import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    quote: "First Grade Lingua Consult has been instrumental in our regional expansion. Their translation accuracy and cultural sensitivity have helped us connect with audiences across West Africa.",
    author: 'Sarah Chen',
    role: 'Director of Communications',
    company: 'Global Development Partners',
  },
  {
    quote: "The voice-over quality exceeded our expectations. The team understood our brand voice perfectly and delivered on an extremely tight deadline.",
    author: 'Michael Adebayo',
    role: 'Marketing Manager',
    company: 'TechVentures Africa',
  },
  {
    quote: "Their interpretation services during our international conference were flawless. Professional, punctual, and highly skilled interpreters.",
    author: 'Dr. Fatima Hassan',
    role: 'Program Director',
    company: 'African Health Initiative',
  },
  {
    quote: "We've worked with many language service providers, but First Grade stands out for their commitment to quality and client service.",
    author: 'James Okonkwo',
    role: 'CEO',
    company: 'Pan-African Media Group',
  },
];

export const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-muted/30">
      <div className="container-premium">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Don't just take our word for it—hear from the organizations we've helped succeed.
          </p>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-card rounded-3xl p-8 md:p-12 lg:p-16 shadow-premium-lg border border-border">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-12 w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shadow-glow">
              <Quote className="w-6 h-6 text-secondary-foreground" />
            </div>

            {/* Content */}
            <div className="relative">
              <motion.blockquote
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-medium"
              >
                "{testimonials[currentIndex].quote}"
              </motion.blockquote>

              <motion.div
                key={`author-${currentIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="font-display font-semibold text-foreground text-lg">
                    {testimonials[currentIndex].author}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-secondary'
                      : 'bg-border hover:bg-muted-foreground'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
