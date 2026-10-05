import React from 'react';

const PageLoader: React.FC = () => (
  <div
    className="flex min-h-screen w-full flex-col items-center justify-center bg-[#0F1E2E] px-6 text-center text-[#F7F5F0]"
    role="status"
    aria-live="polite"
    aria-label="Loading page"
  >
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full border-4 border-[#C6A75E]/25 border-t-[#C6A75E] animate-spin"></div>
      <div className="text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#C6A75E]">
          Harrington & Co
        </p>
        <p className="mt-2 text-sm text-[#F7F5F0]/70">Loading page</p>
      </div>
    </div>
    <span className="sr-only">Loading page</span>
  </div>
);

export default PageLoader;
