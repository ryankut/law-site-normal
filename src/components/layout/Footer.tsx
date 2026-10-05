import React from 'react';
import { Mail, Phone, ArrowUpRight, Heart } from 'lucide-react';
import { Twitter, Instagram, Linkedin } from '@/components/icons/BrandIcons';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer
      className="bg-[#0F1E2E] text-[#F7F5F0] pt-12 pb-8 border-t border-white/5"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Contact */}
          <div className="space-y-6 order-last lg:order-first">
            <div>
              <h3 className="text-sm font-bold serif mb-6 tracking-widest text-[#C6A75E] uppercase">
                Contact
              </h3>
              <div className="space-y-4">
                <a
                  href="mailto:mfredebel@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-2 border-b border-white/5 hover:border-[#C6A75E]/30 transition-all"
                  aria-label="Send me an email"
                >
                  <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-sm group-hover:bg-[#C6A75E]/10">
                    <Mail size={14} className="text-[#C6A75E]" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                      Email
                    </span>
                    <span className="block text-xs font-light group-hover:text-[#C6A75E] transition-colors font-sans">
                      mfredebel@gmail.com
                    </span>
                  </div>
                </a>

                <a
                  href="https://wa.me/2349065624016"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-2 border-b border-white/5 hover:border-[#C6A75E]/30 transition-all"
                  aria-label="Chat with me on WhatsApp"
                >
                  <div className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-sm group-hover:bg-[#C6A75E]/10">
                    <Phone size={14} className="text-[#C6A75E]" />
                  </div>
                  <div>
                    <span className="block text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">
                      WhatsApp
                    </span>
                    <span className="block text-xs font-light group-hover:text-[#C6A75E] transition-colors font-sans">
                      09065624016
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:pl-10">
            <h3 className="text-sm font-bold serif mb-6 tracking-widest text-[#C6A75E] uppercase">
              Quick Access
            </h3>
            <nav aria-label="Footer Quick Links">
              <ul className="space-y-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.href}
                      className={({ isActive }) =>
                        `text-xs transition-all duration-300 flex items-center group font-sans ${
                          isActive ? 'text-[#C6A75E]' : 'text-[#F7F5F0]/70 hover:text-[#C6A75E]'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Legal & Privacy */}
          <div className="lg:pl-5">
            <h3 className="text-sm font-bold serif mb-6 tracking-widest text-[#C6A75E] uppercase">
              Compliance
            </h3>
            <nav aria-label="Footer Compliance Links">
              <ul className="space-y-3">
                {[
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms and Conditions', href: '/terms' },
                  { name: 'Client Portal', href: '#' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="text-xs text-[#F7F5F0]/70 hover:text-[#C6A75E] transition-all duration-300 flex items-center justify-between group font-sans"
                    >
                      {item.name}
                      <ArrowUpRight
                        size={10}
                        className="opacity-0 group-hover:opacity-60 transition-opacity"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4: Engagement */}
          <div>
            <h3 className="text-sm font-bold serif mb-6 tracking-widest text-[#C6A75E] uppercase">
              Connect
            </h3>
            <div className="flex gap-3">
              {[
                { icon: Twitter, href: 'https://x.com/mfredebel', label: 'X' },
                { icon: Linkedin, href: 'https://www.linkedin.com/in/fredebel-m-bab914282/', label: 'LinkedIn' },
                { icon: Instagram, href: 'https://www.instagram.com/mfredebel/', label: 'Instagram' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit my ${social.label} profile`}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-[#C6A75E] hover:border-[#C6A75E] hover:text-[#0F1E2E] transition-all duration-500 rounded-sm"
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright (Left) Credit (Right) */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 font-sans">
          <p className="text-[9px] text-white/30 uppercase tracking-widest font-light order-2 md:order-1 text-center md:text-left">
            &copy; 2026 Fredebel Menoh. All Rights Reserved.
          </p>

          <div className="flex items-center gap-1.5 text-[8px] text-white/20 uppercase tracking-[0.3em] font-bold order-1 md:order-2">
            <span>Partner with</span>
            <Heart size={8} className="text-red-500 fill-red-500" />
            <span>Cheruto & Nashali Advocates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
