import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4" aria-labelledby="hero-title">
      {/* Background Image with Deep Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=2000"
          alt=""
          className="w-full h-full object-cover object-center"
          role="presentation"
        />
        <div className="absolute inset-0 bg-[#0F1E2E]/80"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl pt-16 md:pt-24">
        <span className="text-[#C6A75E] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-[8px] md:text-[10px] mb-2 md:mb-3 block animate-in fade-in slide-in-from-top-4 duration-1000">
          Visionary Counsel • Decisive Action
        </span>
        <h1 id="hero-title" className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-[#F7F5F0] font-bold leading-[1.15] mb-4 md:mb-5 serif animate-in fade-in slide-in-from-bottom-6 duration-1000">
          Commissioners for Oaths, Notaries Public & CPS
        </h1>
        <p className="text-xs md:text-base text-[#F7F5F0]/70 mb-6 md:mb-8 max-w-xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          Cheruto & Nashali Advocates is a client-focused boutique law firm committed to innovative solutions and the best possible outcomes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <Link
            to="/contact"
            className="px-10 py-5 bg-[#C6A75E] text-[#0F1E2E] font-bold rounded-sm hover:bg-[#F7F5F0] transition-all duration-300 tracking-[0.2em] uppercase text-xs shadow-2xl flex items-center gap-3 w-fit mx-auto md:mx-0"
            aria-label="Schedule a consultation with Cheruto & Nashali Advocates"
          >
            Hire Now <ArrowUpRight size={18} className="shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
