'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, TrendingUp, Zap } from 'lucide-react';
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

export default function RecommendationsPage() {
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
          
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            AI Recommendations
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed">
            Discover your next favorite book with our advanced AI matching algorithm. We analyze your reading preferences to find books you'll love.
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass rounded-3xl p-12 text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
          </div>
          <p className="text-gray-400 mt-4">Analyzing your preferences...</p>
        </div>
      )}

      {/* Content */}
      {!loading && data && (
        <>
          {/* Personalized Recommendations */}
          {data.personalized && data.personalized.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-bold">Personalized for You</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.personalized.map((book) => renderBadgeCard(book))}
              </div>
            </section>
          )}

          {/* Trending Now */}
          {data.trending && data.trending.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <h2 className="text-3xl font-bold">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.trending.map((book) => renderBadgeCard(book))}
              </div>
            </section>
          )}

          {/* Similar to Your Reads */}
          {data.similar && data.similar.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Zap className="w-6 h-6 text-yellow-500" />
                <h2 className="text-3xl font-bold">Similar to Your Reads</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.similar.map((book) => renderBadgeCard(book))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !data && (
        <div className="glass rounded-3xl p-12 text-center">
          <BrainCircuit className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No recommendations available</h3>
          <p className="text-gray-400">Try reading more books to get personalized recommendations.</p>
        </div>
      )}
    </div>
  );
}
