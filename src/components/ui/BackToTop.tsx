
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top cordinate to 0
  // make scrolling smooth
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      <button
        type="button"
        onClick={scrollToTop}
        className={`
          group flex items-center justify-center w-12 h-12 rounded-sm
          bg-[#0F1E2E] border border-[#C6A75E]/30 text-[#C6A75E]
          shadow-2xl transition-all duration-500 ease-in-out
          hover:bg-[#C6A75E] hover:text-[#0F1E2E] hover:border-[#C6A75E]
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
        aria-label="Back to top"
      >
        <ChevronUp className="w-6 h-6 transition-transform group-hover:-translate-y-1" />
      </button>
    </div>
  );
};

export default BackToTop;
