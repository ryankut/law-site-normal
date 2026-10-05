import React, { useCallback } from 'react';
import { useContent } from '../hooks/useContent';
import { contentService } from '../services/contentService';

const AboutPage: React.FC = () => {
  const fetchTeam = useCallback(() => contentService.getAttorneys(), []);
  const { data: team, loading, error, refetch } = useContent(fetchTeam);
  const hasTeam = (team?.length ?? 0) > 0;

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <section className="relative py-40 w-full overflow-hidden flex flex-col items-center justify-center text-center px-6 bg-[#0F1E2E]">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-[#C6A75E] font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs mb-4 block">
            About Us
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#F7F5F0] mb-6 serif leading-[1.1]">
            Our Firm.
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[#F7F5F0]/70 font-light leading-relaxed mx-auto">
            Decades of combined experience delivering strategic counsel across complex commercial
            and private matters.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F1E2E] serif mb-16 text-center">
            Meet the Team
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-4/5 bg-slate-200 mb-6" />
                  <div className="h-5 bg-slate-200 w-2/3 mx-auto mb-2" />
                  <div className="h-4 bg-slate-200 w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center space-y-4">
              <p className="text-red-500">Team information is temporarily unavailable.</p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-[#0F1E2E] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !hasTeam ? (
            <p className="text-slate-500 text-center">No team members have been added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {team?.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="aspect-4/5 overflow-hidden rounded-sm mb-6 bg-[#0F1E2E]/5">
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.fullName}
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#0F1E2E] serif">{member.fullName}</h3>
                  <p className="text-[#C6A75E] text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
                    {member.roleTitle}
                  </p>
                  {member.bio && (
                    <p className="text-slate-600 text-sm font-light leading-relaxed">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;