import React, { useCallback } from 'react';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { contentService } from '../services/contentService';

const HomePage: React.FC = () => {
  const fetchPracticeAreas = useCallback(() => contentService.getPracticeAreas(), []);
  const { data: practiceAreas, loading: areasLoading } = useContent(fetchPracticeAreas);

  const fetchClientLogos = useCallback(() => contentService.getTestimonials(), []);
  const { data: clientLogos, loading: logosLoading } = useContent(fetchClientLogos);

  const featuredAreas = (practiceAreas ?? []).slice(0, 3);
  const hasClientLogos = (clientLogos?.length ?? 0) > 0;

  return (
    <div className="bg-[#F7F5F0]">
      {/* Hero */}
      <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2000"
            alt="Firm Interior"
            className="w-full h-full object-cover object-center grayscale brightness-[0.3] scale-105 keep-grayscale"
          />
          <div className="absolute inset-0 bg-[#0F1E2E]/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <span className="text-[#C6A75E] font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs mb-4">
              Counsel Without Compromise
            </span>
            <div className="w-12 h-px bg-[#C6A75E]/40"></div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-[#F7F5F0] mb-8 serif leading-[1.1]">
            Elite Legal Advocacy for Complex Interests.
          </h1>

          <p className="max-w-2xl text-sm md:text-base text-[#F7F5F0]/70 font-light leading-relaxed mx-auto mb-12">
            We provide strategic legal counsel to individuals and enterprises navigating high-stakes
            commercial, regulatory, and private matters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/book-consultation"
              className="px-8 py-4 bg-[#C6A75E] text-[#0F1E2E] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#F7F5F0] transition-colors"
            >
              Book a Consultation
            </Link>
            <Link
              to="/practice"
              className="px-8 py-4 border border-[#F7F5F0]/30 text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#F7F5F0]/10 transition-colors"
            >
              Explore Practice Areas
            </Link>
          </div>
        </div>
      </section>

      {/* Practice Areas preview */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-[#C6A75E] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                What We Do
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#0F1E2E] serif leading-tight">
                Practice Areas.
              </h2>
            </div>
            <Link
              to="/practice"
              className="inline-flex items-center text-[10px] font-bold text-[#0F1E2E] uppercase tracking-[0.3em] hover:text-[#C6A75E] transition-colors"
            >
              View All Practice Areas
              <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>

          {areasLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-12 border border-[#0F1E2E]/10 rounded-sm h-64" />
              ))}
            </div>
          ) : featuredAreas.length === 0 ? (
            <p className="text-slate-500">No practice areas have been added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredAreas.map((area) => (
                <Link
                  key={area.id}
                  to="/practice"
                  className="group flex flex-col h-full bg-white p-12 border border-[#0F1E2E]/10 hover:border-[#C6A75E]/30 hover:shadow-[0_20px_50px_rgba(15,30,46,0.08)] transition-all duration-500 rounded-sm"
                >
                  <div className="mb-10 text-[#C6A75E] transition-transform duration-500 group-hover:scale-110 origin-left">
                    {area.iconUrl ? (
                      <img src={area.iconUrl} alt="" className="w-10 h-10 object-contain" />
                    ) : (
                      <Briefcase className="w-10 h-10" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F1E2E] mb-4 serif leading-tight">
                    {area.name}
                  </h3>
                  <p className="text-slate-700 leading-relaxed font-light text-sm line-clamp-3">
                    {area.shortDesc || area.body}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Client Logos */}
      {!logosLoading && hasClientLogos && (
        <section className="py-20 bg-white border-y border-[#0F1E2E]/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-[#0F1E2E]/40 mb-12">
              Trusted By
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {clientLogos?.map((logo) => (
                logo.websiteUrl ? (
                  <a
                    key={logo.id}
                    href={logo.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                  >
                    <img src={logo.logoUrl} alt={logo.companyName} className="h-8 md:h-10 object-contain" />
                  </a>
                ) : (
                  <img
                    key={logo.id}
                    src={logo.logoUrl}
                    alt={logo.companyName}
                    className="h-8 md:h-10 object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100"
                  />
                )
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-28 bg-[#0F1E2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl text-[#F7F5F0] font-bold serif leading-tight mb-8">
            Ready to Discuss Your Matter?
          </h2>
          <p className="text-[#F7F5F0]/60 text-lg font-light leading-relaxed mb-12">
            Schedule a confidential consultation with our team.
          </p>
          <Link
            to="/book-consultation"
            className="inline-block px-10 py-4 bg-[#C6A75E] text-[#0F1E2E] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#F7F5F0] transition-colors"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;