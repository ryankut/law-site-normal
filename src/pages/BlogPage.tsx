import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../hooks/useContent';
import { contentService } from '../services/contentService';

const BlogPage: React.FC = () => {
  const fetchArticles = useCallback(() => contentService.getBlogPosts(), []);
  const { data: articles, loading: articlesLoading, error: articlesError, refetch } = useContent(fetchArticles);

  const fetchCategories = useCallback(() => contentService.getNewsCategories(), []);
  const { data: categories } = useContent(fetchCategories);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const publishedArticles = useMemo(
    () => (articles ?? []).filter((a) => a.status === 'PUBLISHED'),
    [articles],
  );

  const filteredArticles = useMemo(
    () =>
      activeCategory
        ? publishedArticles.filter((a) => a.categoryId === activeCategory)
        : publishedArticles,
    [publishedArticles, activeCategory],
  );

  const hasArticles = filteredArticles.length > 0;

  return (
    <div className="bg-[#F7F5F0]">
      {/* Hero */}
      <section className="relative py-40 w-full overflow-hidden flex flex-col items-center justify-center text-center px-6 bg-[#0F1E2E]">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-[#C6A75E] font-bold tracking-[0.6em] uppercase text-[10px] md:text-xs mb-4 block">
            Insights
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#F7F5F0] mb-6 serif leading-[1.1]">
            News &amp; Insights.
          </h1>
          <p className="max-w-2xl text-sm md:text-base text-[#F7F5F0]/70 font-light leading-relaxed mx-auto">
            Commentary and updates from our legal team on the matters shaping our practice areas.
          </p>
        </div>
      </section>

      {/* Category filter */}
      {categories && categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border transition-colors ${
                activeCategory === null
                  ? 'bg-[#0F1E2E] text-[#F7F5F0] border-[#0F1E2E]'
                  : 'border-[#0F1E2E]/20 text-[#0F1E2E]/60 hover:border-[#0F1E2E]/40'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full border transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#0F1E2E] text-[#F7F5F0] border-[#0F1E2E]'
                    : 'border-[#0F1E2E]/20 text-[#0F1E2E]/60 hover:border-[#0F1E2E]/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Article grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {articlesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-slate-200 mb-4 rounded-sm" />
                  <div className="h-5 bg-slate-200 w-3/4 mb-2" />
                  <div className="h-4 bg-slate-200 w-1/2" />
                </div>
              ))}
            </div>
          ) : articlesError ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-red-500">Articles are temporarily unavailable.</p>
              <button
                type="button"
                onClick={refetch}
                className="px-6 py-3 bg-[#0F1E2E] text-[#F7F5F0] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C6A75E] hover:text-[#0F1E2E] transition-colors"
              >
                Retry
              </button>
            </div>
          ) : !hasArticles ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No articles published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/blog/${article.slug}`}
                  className="group flex flex-col bg-white border border-[#0F1E2E]/10 hover:border-[#C6A75E]/30 hover:shadow-[0_20px_50px_rgba(15,30,46,0.08)] transition-all duration-500 rounded-sm overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden bg-[#0F1E2E]/5">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    {article.category && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A75E] mb-3">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="text-xl font-bold text-[#0F1E2E] mb-3 serif leading-snug line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-slate-600 text-sm font-light leading-relaxed line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                      <span>{article.author?.fullName || 'Firm Staff'}</span>
                      {article.publishedAt && (
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;