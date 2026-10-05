import React from 'react';
import { Target, Eye, Gem } from 'lucide-react';
import TrackRecord from '../components/features/TrackRecord';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F7F5F0]" id="main-content">
      {/* Refined Hero Header - Aligned with Homepage Style */}
      <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center text-center px-6">
        {/* Background Image with Desaturated Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=2000"
            alt="Library Architecture"
            className="w-full h-full object-cover object-center grayscale brightness-[0.3] scale-105 keep-grayscale"
          />
          <div className="absolute inset-0 bg-[#0F1E2E]/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <span className="text-[#C6A75E] font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs mb-4 animate-in fade-in slide-in-from-top-4 duration-1000">
              Our Heritage
            </span>
            <div className="w-12 h-px bg-[#C6A75E]/40"></div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-[#F7F5F0] mb-8 serif leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Defining the Standards <br className="hidden sm:block" /> of Global Advocacy.
          </h1>

          <p className="max-w-2xl text-sm md:text-base text-[#F7F5F0]/70 font-light leading-relaxed mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            Harrington and Co serves as the definitive vanguard for elite interests, blending generational wisdom with contemporary strategic rigor.
          </p>
        </div>

        {/* Minimal Scroll Cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
          <span className="text-[8px] uppercase tracking-[0.5em] text-[#F7F5F0] font-bold">The Legacy</span>
          <div className="w-px h-12 bg-linear-to-b from-[#C6A75E] to-transparent"></div>
        </div>
      </section>

      {/* The Harrington Legacy */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 border border-[#C6A75E]/20 rounded-sm -z-10 group-hover:scale-105 transition-transform duration-700"></div>
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200"
                alt="Architectural Detail"
                className="w-full h-[600px] object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000 keep-grayscale"
              />
              <div className="absolute bottom-10 left-10 right-10 p-8 bg-[#0F1E2E]/90 backdrop-blur-md border-l-4 border-[#C6A75E]">
                <h3 className="text-[#F7F5F0] text-2xl font-bold serif mb-2 italic">"Vision is the foundation of every triumph."</h3>
                <p className="text-[#C6A75E] text-[10px] font-bold uppercase tracking-[0.3em]">HARRINGTON CORE PHILOSOPHY</p>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-[#0F1E2E] serif">A Heritage of Unrivaled Insight</h2>
                <p className="text-[#4A5568] text-lg font-light leading-relaxed">
                  Established on the principle that superior counsel requires more than legal knowledge, Harrington and Co operates as a high-level strategic partner. We don't merely respond to circumstances; we anticipate the variables that define the future.
                </p>
                <p className="text-[#4A5568] leading-relaxed">
                  Our firm represents a synthesis of classical jurisprudence and forward-looking economic intelligence. Whether securing maritime corridors or architecting complex cross-border acquisitions, we provide the steady hand and sharp intellect required by the world's most ambitious leaders.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#0F1E2E] serif">24+</div>
                  <p className="text-[#C6A75E] text-[10px] font-bold uppercase tracking-widest">Global Jurisdictions</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-[#0F1E2E] serif">98%</div>
                  <p className="text-[#C6A75E] text-[10px] font-bold uppercase tracking-widest">Advisory Retention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Track Record */}
      <TrackRecord />

      {/* The Strategic Mandate: Mission, Vision, Values (Non-card design) */}
      <section className="py-32 bg-[#0F1E2E] relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#C6A75E]/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-24">
            <span className="text-[#C6A75E] font-bold tracking-[0.4em] uppercase text-xs mb-6 block">Our Strategic Mandate</span>
            <h2 className="text-4xl md:text-6xl text-[#F7F5F0] font-bold serif leading-tight">Engineering the Future of Advocacy.</h2>
          </div>

          <div className="space-y-32 relative">
            {/* Connecting Line */}
            <div className="absolute left-[39px] top-10 bottom-10 w-px bg-linear-to-b from-[#C6A75E] via-[#C6A75E]/20 to-transparent hidden md:block"></div>

            {/* Mission */}
            <div className="relative md:pl-24 group">
              <div className="absolute left-0 top-0 hidden md:flex items-center justify-center w-20 h-20 bg-[#0F1E2E] border border-[#C6A75E]/30 rounded-full z-20 group-hover:border-[#C6A75E] transition-colors duration-500">
                <Target className="text-[#C6A75E] w-8 h-8" />
              </div>
              <div className="absolute -left-10 top-[-40px] opacity-[0.03] text-[12rem] font-serif text-[#C6A75E] pointer-events-none select-none">M</div>
              <div className="max-w-4xl">
                <h3 className="text-[#C6A75E] text-xs font-bold uppercase tracking-[0.5em] mb-4">The Mission</h3>
                <h4 className="text-3xl md:text-4xl text-[#F7F5F0] font-bold serif mb-8 leading-snug">To engineer elite legal frameworks that safeguard the global interests and multi-generational legacies of the world's most ambitious enterprises.</h4>
                <p className="text-[#F7F5F0]/40 text-lg font-light leading-relaxed">
                  Our mission is rooted in the belief that legal counsel should be a catalyst for growth, not just a response to risk. We provide the architecture for success in an increasingly complex global marketplace.
                </p>
              </div>
            </div>

            {/* Vision */}
            <div className="relative md:pl-24 group">
              <div className="absolute left-0 top-0 hidden md:flex items-center justify-center w-20 h-20 bg-[#0F1E2E] border border-[#C6A75E]/30 rounded-full z-20 group-hover:border-[#C6A75E] transition-colors duration-500">
                <Eye className="text-[#C6A75E] w-8 h-8" />
              </div>
              <div className="absolute -left-10 top-[-40px] opacity-[0.03] text-[12rem] font-serif text-[#C6A75E] pointer-events-none select-none">V</div>
              <div className="max-w-4xl">
                <h3 className="text-[#C6A75E] text-xs font-bold uppercase tracking-[0.5em] mb-4">The Vision</h3>
                <h4 className="text-3xl md:text-4xl text-[#F7F5F0] font-bold serif mb-8 leading-snug">To remain the definitive vanguard of sophisticated advocacy, setting the benchmark for strategic foresight across 24+ global jurisdictions.</h4>
                <p className="text-[#F7F5F0]/40 text-lg font-light leading-relaxed">
                  We envision a future where Harrington and Co is synonymous with the highest level of intellectual rigor, serving as the trusted advisor to the global commercial elite.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="relative md:pl-24 group">
              <div className="absolute left-0 top-0 hidden md:flex items-center justify-center w-20 h-20 bg-[#0F1E2E] border border-[#C6A75E]/30 rounded-full z-20 group-hover:border-[#C6A75E] transition-colors duration-500">
                <Gem className="text-[#C6A75E] w-8 h-8" />
              </div>
              <div className="absolute -left-10 top-[-40px] opacity-[0.03] text-[12rem] font-serif text-[#C6A75E] pointer-events-none select-none">C</div>
              <div className="max-w-4xl">
                <h3 className="text-[#C6A75E] text-xs font-bold uppercase tracking-[0.5em] mb-4">Core Values</h3>
                <h4 className="text-3xl md:text-4xl text-[#F7F5F0] font-bold serif mb-12">Foundational Integrity. <br /> Absolute Precision.</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <h5 className="text-[#F7F5F0] font-bold serif text-xl">Integrity</h5>
                    <p className="text-[#F7F5F0]/40 text-sm font-light leading-relaxed">Unwavering ethical alignment in high-stakes environments, ensuring our counsel is as honorable as it is effective.</p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[#F7F5F0] font-bold serif text-xl">Intellectual Rigor</h5>
                    <p className="text-[#F7F5F0]/40 text-sm font-light leading-relaxed">Deep analytical exploration of every brief, leaving no variable unexamined in our pursuit of the optimal outcome.</p>
                  </div>
                  <div className="space-y-4">
                    <h5 className="text-[#F7F5F0] font-bold serif text-xl">Absolute Discretion</h5>
                    <p className="text-[#F7F5F0]/40 text-sm font-light leading-relaxed">The sanctuary of our clients' affairs is absolute. We maintain an impenetrable environment for sensitive interests.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
