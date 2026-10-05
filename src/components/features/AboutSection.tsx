import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutSection: React.FC = () => {
  return (
    <section className="py-20 md:py-32 bg-[#F7F5F0] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -top-10 -left-10 w-24 md:w-40 h-24 md:h-40 bg-[#C6A75E]/5 rounded-full -z-10"></div>
            <div className="relative z-10 group">
              <img
                src="assets/images/cherutoandnashali.png"
                alt="Photo of firm advocates"
                className="w-full h-100 md:h-150 object-cover rounded-sm shadow-[0_35px_60px_-15px_rgba(15,30,46,0.2)] transition-all duration-1000"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 p-6 md:p-10 bg-white/5 backdrop-blur-lg border border-white/10 border-l-4 border-l-[#C6A75E] shadow-2xl z-20 transition-all duration-500 group-hover:scale-105 group-hover:bg-white/10">
                <p className="text-[#F7F5F0] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold serif italic mb-1 md:mb-2 leading-tight">
                  Cheruto and Nashali
                </p>
                <p className="text-[#C6A75E] text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  Advocates & Solicitors
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8 order-1 lg:order-2">
            <div>
              <span className="text-[#C6A75E] font-bold tracking-[0.3em] uppercase text-xs mb-4 block">
                About Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0F1E2E] mb-6 md:mb-8 serif leading-tight">
                Where Strategy Meets Advocacy.
              </h2>
              <div className="w-16 h-1 bg-[#C6A75E] mb-8"></div>
            </div>

            <p className="text-[#2D3748] text-base md:text-lg leading-relaxed font-light">
              Cheruto &amp; Nashali Advocates is a dynamic and client-focused boutique law firm based in
              Nairobi with Boffice Branches in Mombasa Kakamega. We are dedicated to providing exceptional
              legal services across a range of practice areas. We are committed to delivering innovative
              solutions, building strong client relationships, and achieving the best possible outcomes for
              our clients. Our team of experienced and dedicated legal professionals possesses a deep
              understanding of the law and a passion for advocating for our clients' interests.
            </p>

            <p className="text-[#2D3748] leading-relaxed text-sm md:text-base">
              We approach each assignment with robust dedication with only one objective in mind to deliver
              to the client.
            </p>

            <div className="flex flex-wrap gap-10 md:gap-12 py-4">
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-[#0F1E2E] serif">Nairobi</div>
                <div className="text-[#C6A75E] text-[10px] font-bold uppercase tracking-widest mt-1">
                  Headquarters
                </div>
              </div>
              <div className="hidden sm:block h-10 w-px bg-slate-200"></div>
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-[#0F1E2E] serif">Mombasa</div>
                <div className="text-[#C6A75E] text-[10px] font-bold uppercase tracking-widest mt-1">
                  Regional Office
                </div>
              </div>
              <div className="text-left">
                <div className="text-2xl md:text-3xl font-bold text-[#0F1E2E] serif">Kakamega</div>
                <div className="text-[#C6A75E] text-[10px] font-bold uppercase tracking-widest mt-1">
                  Regional Office
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/about"
                className="flex items-center gap-3 w-fit px-10 py-5 bg-[#0F1E2E] text-[#F7F5F0] font-bold rounded-sm hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-all duration-300 tracking-[0.2em] uppercase text-xs shadow-xl whitespace-nowrap"
              >
                Discover Our Story <ArrowUpRight size={18} className="shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;