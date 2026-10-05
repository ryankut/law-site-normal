import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { contentService, type NewsArticle } from '../services/contentService';

const NewsArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    contentService
      .getArticleBySlug(slug)
      .then(setArticle)
      .catch(() => setError('This article could not be found.'))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="bg-[#F7F5F0] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Link
          to="/blog"
          className="inline-flex items-center text-[10px] font-bold text-[#0F1E2E]/60 uppercase tracking-[0.3em] hover:text-[#C6A75E] transition-colors mb-12"
        >
          <ArrowLeft className="mr-3 w-4 h-4" />
          Back to Insights
        </Link>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 w-1/4" />
            <div className="h-10 bg-slate-200 w-3/4" />
            <div className="aspect-video bg-slate-200" />
          </div>
        ) : error || !article ? (
          <p className="text-red-500">{error || 'Article not found.'}</p>
        ) : (
          <article>
            {article.category && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C6A75E] mb-4 block">
                {article.category.name}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold text-[#0F1E2E] serif leading-tight mb-6">
              {article.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-400 mb-10 pb-10 border-b border-[#0F1E2E]/10">
              <span>{article.author?.fullName || 'Firm Staff'}</span>
              {article.publishedAt && (
                <>
                  <span>&middot;</span>
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
            {article.featuredImage && (
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full aspect-video object-cover rounded-sm mb-10"
              />
            )}
            <div className="prose prose-slate max-w-none font-light leading-relaxed whitespace-pre-wrap">
              {article.body}
            </div>
          </article>
        )}
      </div>
    </div>
  );
};

export default NewsArticlePage;