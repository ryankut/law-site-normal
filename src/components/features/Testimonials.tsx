import React, { useCallback } from 'react';
import { Quote } from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import { contentService } from '../../services/contentService';

const AnimatedText: React.FC<{ text: string; delay: number }> = ({ text, delay }) => {
  const words = text.split(' ');

  return (
    <p className="text-[#4A5568] leading-relaxed font-light mb-8 italic text-sm md:text-base">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block transition-all duration-700 opacity-0 blur-sm translate-y-2"
          style={{
            animation: `assemble 0.6s ease forwards ${delay + i * 0.03}s`,
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </p>
  );
};

const Testimonials: React.FC = () => {
  const fetchTestimonials = useCallback(() => contentService.getTestimonials(), []);
  const { data: testimonials, loading, error, refetch } = useContent(fetchTestimonials);

  // Use exactly three testimonials as requested
  const displayTestimonials = testimonials?.slice(0, 3) || [];
  const hasTestimonials = displayTestimonials.length > 0;

  return (
    <section className="py-32 bg-[#F7F5F0] relative overflow-hidden">
      <style>{`
        @keyframes assemble {
          to {
            opacity: 1;
            filter: blur(0);
            transform: translateY(0);
          }
        }
        .testimonial-card {
          transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.5s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 30px 60px -12px rgba(15, 30, 46, 0.15);
        }
        .testimonial-image {
          filter: grayscale(100%);
          transition: filter 0.5s ease;
        }
        .testimonial-card:hover .testimonial-image {
          filter: grayscale(0%);
        }
      `}</style>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-[0.02] text-[15rem] font-serif pointer-events-none select-none text-[#0F1E2E] whitespace-nowrap hidden lg:block">
        Advocacy
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-6">
            <Quote className="text-[#C6A75E]/20 w-12 h-12" fill="currentColor" />
          </div>
          <span className="text-[#C6A75E] font-bold tracking-[0.4em] uppercase text-xs mb-4 block">
            Client Counsel
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#0F1E2E] serif">Verified Testimonials</h2>
          <div className="w-16 h-0.5 bg-[#C6A75E] mx-auto mt-8"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-10 rounded-sm shadow-sm h-[300px] animate-pulse">
                <div className="w-10 h-10 bg-gray-200 mb-6 rounded-sm"></div>
                <div className="h-4 bg-gray-100 mb-4 w-full"></div>
                <div className="h-4 bg-gray-100 mb-4 w-5/6"></div>
                <div className="h-4 bg-gray-100 mb-8 w-4/6"></div>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 w-24"></div>
                    <div className="h-2 bg-gray-100 w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10 space-y-4">
            <p className="text-red-500 font-serif italic text-lg">
              The client counsel feed is temporarily unavailable.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="px-6 py-3 bg-[#0F1E2E] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-colors"
            >
              Retry loading testimonials
            </button>
          </div>
        ) : !hasTestimonials ? (
          <div className="text-center py-10 border border-dashed border-[#0F1E2E]/10 bg-white/60 space-y-4">
            <p className="text-[#4A5568] font-serif italic text-lg">
              No testimonials are available in the current demo feed.
            </p>
            <button
              type="button"
              onClick={refetch}
              className="px-6 py-3 bg-[#0F1E2E] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-colors"
            >
              Retry loading testimonials
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {displayTestimonials.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className="testimonial-card bg-white p-10 border border-[#8A6F3E]/10 rounded-sm relative group flex flex-col h-full shadow-sm"
              >
                <div className="absolute -top-4 left-10 p-2 bg-[#F7F5F0] rounded-sm">
                  <Quote className="text-[#C6A75E] w-5 h-5" fill="currentColor" />
                </div>

                <div className="grow">
                  <AnimatedText text={testimonial.content} delay={0.2 + idx * 0.3} />
                </div>

                <div className="mt-auto pt-8 border-t border-[#F7F5F0] flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border-2 border-[#C6A75E]/20 overflow-hidden shrink-0 group-hover:border-[#C6A75E] transition-colors">
                    <img
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      className="testimonial-image w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#0F1E2E] serif leading-tight">
                      {testimonial.name}
                    </h4>
                    <p className="text-[#C6A75E] font-medium text-[10px] tracking-[0.2em] uppercase mt-0.5">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-12 h-12 bg-linear-to-br from-transparent to-[#C6A75E]/5 pointer-events-none"></div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <p className="text-[#4A5568]/50 text-xs font-light tracking-widest uppercase italic">
            Integrity - Excellence - Professionalism
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
