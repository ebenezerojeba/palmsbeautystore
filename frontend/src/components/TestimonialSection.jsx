import { motion } from 'framer-motion';
import { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ name, service, review, rating, image, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-4"
    >
      <div className="bg-pink-900/100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-border/50 h-full flex flex-col">
        <div className="mb-6">
          <Quote className="w-10 h-10 text-white/20" />
        </div>
        
        <p className="text-gray-50 font-light leading-relaxed mb-6 flex-grow text-lg">
          "{review}"
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < rating ? 'fill-primary text-white' : 'text-yellow'}`} 
            />
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-light text-lg">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-sm text-gray-800 font-light">{service}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TestimonialsSection = ({ testimonials }) => {
const [emblaRef] = useEmblaCarousel(
{ loop: true, align: 'start' },
[Autoplay({ delay: 3000, stopOnInteraction: false })]
);



  return (
    <section id="testimonials" className="py-20 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-extralight text-foreground mb-8 tracking-tight">
            
            <span className="block font-light text-foreground/70">Experiences</span>
          </h2>
          <p className="text-xl text-muted-foreground font-light">
            Stories of transformation and confidence from our valued clients
          </p>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -mx-4">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.name} 
                {...testimonial} 
                delay={index * 100} 
              />
            ))}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className="w-2 h-2 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/60 transition-all duration-300"
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
