import React, { memo } from 'react';

const Newsletter: React.FC = () => {
  return (
    <section className="bg-[#F7F5F0] pt-16 md:pt-20 pb-12 border-t border-slate-200 relative overflow-hidden" aria-labelledby="newsletter-heading">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Tagline */}
          <div className="mb-10">
            <p className="text-[#0F1E2E] text-xl md:text-2xl font-light leading-relaxed serif italic">
              Visionary Counsel. Decisive Action. <span className="text-[#C6A75E]">Your Competitive Legal Advantage.</span>
            </p>
            <p className="text-[#0F1E2E]/50 text-xs mt-3 font-medium uppercase tracking-[0.3em]">
              Elite representation for complex global challenges.
            </p>
          </div>

          {/* Form Container */}
          <div className="w-full bg-white p-8 md:p-10 border border-slate-200 rounded-sm shadow-xl">
            <div className="mb-6">
              <h2 id="newsletter-heading" className="text-2xl md:text-3xl font-bold text-[#0F1E2E] serif mb-2">Stay Informed</h2>
              <p className="text-slate-500 text-sm font-light">Join our inner circle for exclusive legal briefs and regulatory updates.</p>
            </div>

            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <div className="grow">
                <label htmlFor="newsletter-email" className="sr-only">Professional email address</label>
                <input
                  type="email"
                  id="newsletter-email"
                  name="newsletter-email"
                  autoComplete="email"
                  required
                  placeholder="Professional email address"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 text-[#0F1E2E] focus:outline-none focus:border-[#C6A75E] placeholder:text-slate-300 transition-all font-light text-sm font-sans"
                />
              </div>
              <button
                type="submit"
                className="bg-[#0F1E2E] text-[#F7F5F0] px-8 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-all duration-300 shadow-lg whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="w-1 h-1 rounded-full bg-[#C6A75E]"></div>
              <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">Privacy prioritized. Discretion assured.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle background texture */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none select-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C6A75E] blur-[120px] rounded-full"></div>
      </div>
    </section>
  );
};

export default memo(Newsletter);
