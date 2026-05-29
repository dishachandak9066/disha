'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Flame } from 'lucide-react';
import LibraryBookCard, { LibraryBook } from '@/components/dashboard/LibraryBookCard';
import { useTranslation } from '@/context/TranslationContext';
import { apiFetch } from '@/lib/api';

interface RecommendedBook extends LibraryBook {
  matchScore: number;
}

export default function TrendingPage() {
  const [trending, setTrending] = useState<RecommendedBook[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await apiFetch('/api/recommendations');
        if (res.data && res.data.trending) {
          setTrending(res.data.trending);
        } else if (res.trending) {
          setTrending(res.trending);
        }
      } catch (error) {
        console.error('Failed to fetch trending data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      {/* Hero Section */}
      <div className="glass rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none -mt-40 -mr-40 group-hover:bg-orange-500/30 transition-colors duration-700" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full text-orange-400 font-bold uppercase tracking-wider mb-6 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <TrendingUp className="w-5 h-5 animate-pulse" />
            {t('top_charts')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('trending_now')}</h1>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {t('discover_everyone')}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
            <div key={card} className="w-full aspect-[2/3] bg-white/5 rounded-2xl animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          ))}
        </div>
      ) : trending.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {trending.map((book, index) => (
            <div key={book.id} className="relative group">
              {/* Rank Badge */}
              <div className="absolute -top-3 -left-3 z-20 w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center shadow-lg border-2 border-[#09090b]">
                {index + 1}
              </div>

              <LibraryBookCard book={book} viewMode="grid" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-400 py-20 bg-white/5 rounded-2xl border border-white/10">
          <TrendingUp className="w-12 h-12 mx-auto text-gray-500 mb-4 opacity-50" />
          <p className="text-lg">{t('no_trending')}</p>
        </div>
      )}
    </div>
  );
}
