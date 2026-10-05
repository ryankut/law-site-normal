import React, { useRef, useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../constants';
import Logo from '../ui/Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  };

  return (
    <>
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-[#C6A75E] focus:text-[#0F1E2E] focus:font-bold focus:rounded-sm focus:outline-none"
      >
        Skip to content
      </a>

      <nav
        className={`fixed top-0 left-0 w-full z-60 transition-all duration-700 ${
          scrolled ? 'bg-[#0F1E2E]/95 backdrop-blur-md shadow-2xl py-3' : 'bg-transparent py-5'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/"
              className="flex items-center space-x-3 group shrink-0"
              aria-label="Harrington & Co. Home"
            >
              <Logo className="w-8 h-8 md:w-9 md:h-9" light={true} />
              <div className="flex flex-col justify-center">
                <span className="text-sm md:text-base font-bold tracking-[0.3em] text-[#F7F5F0] serif leading-none uppercase">
                  CHERUTO & NASHALI
                </span>
                <span className="text-[7px] md:text-[8px] tracking-[0.5em] text-[#C6A75E] font-bold uppercase mt-1 opacity-90">
                  ADVOCATES
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-10">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-[9px] font-bold uppercase tracking-[0.3em] transition-colors relative group py-2 ${
                      isActive ? 'text-[#C6A75E]' : 'text-[#F7F5F0]/60 hover:text-[#C6A75E]'
                    }`
                  }
                >
                  {link.name}
                  <div className="absolute -bottom-[2px] left-0 w-full h-px bg-[#C6A75E] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </NavLink>
              ))}

              <Link
                to="/contact"
                className="hidden md:flex items-center gap-2 px-8 py-3 bg-[#C6A75E] text-[#0F1E2E] font-bold rounded-sm hover:bg-[#F7F5F0] transition-colors duration-300 tracking-widest uppercase text-[10px] shadow-lg"
              >
                Hire Now <ArrowUpRight size={14} className="shrink-0" />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-4">
              <button
                ref={menuButtonRef}
                onClick={() => setIsOpen(true)}
                className="text-[#F7F5F0] p-2 hover:text-[#C6A75E] transition-colors"
                aria-label="Open menu"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* COMPACT MOBILE SIDEBAR */}
        {isOpen ? (
          <>
            <div
              id="mobile-menu"
              className="fixed top-4 right-4 h-auto w-64 bg-[#0F1E2E]/90 backdrop-blur-xl z-60 transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[-10px_10px_40px_rgba(0,0,0,0.5)] flex flex-col rounded-2xl border border-white/10 translate-x-0 opacity-100 scale-100"
            >
              <div className="flex flex-col h-full p-6 pt-16 relative">
                <button
                  onClick={closeMenu}
                  className="absolute top-5 right-5 text-[#F7F5F0]/60 hover:text-[#C6A75E] transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col space-y-1">
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.name}
                      to={link.href}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `text-[9px] font-bold uppercase tracking-[0.2em] py-4 px-4 transition-all rounded-lg border-l-2 ${
                          isActive
                            ? 'text-[#C6A75E] border-[#C6A75E] bg-white/5'
                            : 'text-[#F7F5F0]/70 border-transparent hover:text-[#C6A75E] hover:bg-white/5'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ))}

                  <Link
                    to="/contact"
                    onClick={closeMenu}
                    className="mt-4 px-4 py-4 bg-[#C6A75E] text-[#0F1E2E] font-bold uppercase tracking-[0.2em] text-center text-[9px] hover:bg-[#F7F5F0] transition-colors rounded-lg flex items-center justify-center gap-2"
                  >
                    Hire Now <ArrowUpRight size={14} className="shrink-0" />
                  </Link>
                </div>

                <div className="mt-8 pb-2 text-center">
                  <Logo className="w-6 h-6 mx-auto mb-2 opacity-30" light={true} />
                  <p className="text-[6px] text-white/20 tracking-[0.4em] uppercase">Private Advisory</p>
                </div>
              </div>
            </div>

            {/* Overlay Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden z-55 transition-opacity duration-500 opacity-100 pointer-events-auto"
              onClick={closeMenu}
            ></div>
          </>
        ) : null}
      </nav>
    </>
  );
};

export default Navbar;
