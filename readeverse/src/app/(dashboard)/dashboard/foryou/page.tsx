'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, Activity, BookOpen, Layers } from 'lucide-react';
import LibraryBookCard, { LibraryBook } from '@/components/dashboard/LibraryBookCard';
import { useTranslation } from '@/context/TranslationContext';
import { apiFetch } from '@/lib/api';

interface RecommendedBook extends LibraryBook {
  matchScore: number;
}

interface Recommendations {
  personalized: RecommendedBook[];
  trending: RecommendedBook[];
  similar: RecommendedBook[];
}

export default function ForYouPage() {
  const [data, setData] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await apiFetch('/api/recommendations');
        // apiFetch returns the json directly
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setData(res);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const renderBadgeCard = (book: RecommendedBook) => (
    <div key={book.id} className="relative group">
      <LibraryBookCard book={book} viewMode="grid" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      
      {/* Hero Section */}
      <div className="glass rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -mt-40 -mr-40 group-hover:bg-primary/30 transition-colors duration-700" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-primary font-bold uppercase tracking-wider mb-6 border border-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
            {t('curated_by_ai')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('discover_next')}</h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {t('ai_analyzed')}
          </p>
          <button className="px-8 py-3.5 bg-white text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {t('explore_ai_picks')}
          </button>
        </div>
      </div>

      {loading ? (
        /* AI Loading Skeleton */
        <div className="space-y-12">
          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                <div className="w-48 h-6 bg-white/5 rounded-md animate-pulse" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4].map((card) => (
                  <div key={card} className="w-full aspect-[2/3] bg-white/5 rounded-2xl animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center py-10 opacity-50">
            <BrainCircuit className="w-12 h-12 text-primary animate-bounce mb-4" />
            <p className="text-primary font-medium tracking-widest uppercase text-sm">{t('ai_thinking')}</p>
          </div>
        </div>
      ) : data ? (
        <div className="space-y-12">
          
          {/* Personalized Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-primary/20 text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{t('top_picks')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {data.personalized?.map(book => renderBadgeCard(book))}
            </div>
          </section>

          {/* Similar Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Layers className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{t('because_you_read')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {data.similar?.map(book => renderBadgeCard(book))}
            </div>
          </section>

          {/* Trending Section */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">{t('trending_in')}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {data.trending?.map(book => renderBadgeCard(book))}
            </div>
          </section>

        </div>
      ) : (
        <div className="text-center text-gray-400 py-20">{t('failed_recommendations')}</div>
      )}
    </div>
  );
}
