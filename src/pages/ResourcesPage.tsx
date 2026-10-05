import React, { useCallback } from 'react';
import { FileText, Download } from 'lucide-react';
import { useContent } from '../hooks/useContent';
import { contentService } from '../services/contentService';

const ResourcesPage: React.FC = () => {
  const fetchResources = useCallback(() => contentService.getResources(), []);
  const { data: resources, loading, error, refetch } = useContent(fetchResources);
  const hasResources = (resources?.length ?? 0) > 0;

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <section className="relative py-40 w-full overflow-hidden flex flex-col items-center justify-center text-center px-6 bg-[#0F1E2E]">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-[#C6A75E] font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs mb-4 block">
            Resources
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#F7F5F0] mb-6 serif leading-[1.1]">
            Documents &amp; Guides.
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[#F7F5F0]/70 font-light leading-relaxed mx-auto">
            Downloadable resources prepared by our legal team.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse h-20 bg-white border border-[#0F1E2E]/10 rounded-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-red-500">Resources are temporarily unavailable.</p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-[#0F1E2E] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !hasResources ? (
            <p className="text-slate-500 text-center">No resources have been added yet.</p>
          ) : (
            <div className="space-y-4">
              {resources?.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-6 bg-white border border-[#0F1E2E]/10 hover:border-[#C6A75E]/30 rounded-sm p-6 transition-colors"
                >
                  <div className="p-3 bg-[#0F1E2E]/5 rounded-sm">
                    <FileText className="w-6 h-6 text-[#0F1E2E]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#0F1E2E] serif text-lg">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-slate-500 text-sm font-light mt-1">{resource.description}</p>
                    )}
                  </div>
                  <Download className="w-5 h-5 text-[#0F1E2E]/30 group-hover:text-[#C6A75E] transition-colors" />
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ResourcesPage;