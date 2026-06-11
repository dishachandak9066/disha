'use client';

import React, { useEffect, useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useRouter } from "next/navigation";

export default function ForYouPage() {
  const { t } = useTranslation();
const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const userId = 'divyangnapaliwal@gmail.com'; // ⚠️ replace with real auth later

        const res = await fetch(`/api/recommendations?userId=${userId}`);
        const json = await res.json();

        console.log("API RESPONSE:", json);

        setData(json);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

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

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('discover_next')}
          </h1>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            {t('ai_analyzed')}
          </p>

          <button className="px-8 py-3.5 bg-white text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {t('explore_ai_picks')}
          </button>
        </div>
      </div>

      {/* RESULTS SECTION */}
      <div className="px-6">

        {loading && <p className="text-gray-400">Loading recommendations...</p>}
        

        {data?.books?.length > 0 && (
  <>
    <h2 className="text-xl font-bold mb-4">
      Recommended For You ({data.genre})
    </h2>

    <div className="grid gap-4">
      {data.books.map((book: any) => (
        <div
          key={book.id}
          onClick={() => router.push(`/reader/${book.id}`)}
          className="p-4 bg-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition"
        >
          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-24 rounded mb-3"
            />
          )}

          <h3 className="font-semibold">
            {book.title}
          </h3>

          <p className="text-sm text-gray-400">
            {book.author}
          </p>

          <p className="text-xs text-primary mt-2">
            {book.genre}
          </p>
        </div>
      ))}
    </div>
  </>
)}

{!loading && (!data?.books || data.books.length === 0) && (
  <p className="text-gray-400">
    No recommendations available yet.
  </p>
)}
      </div>
    </div>
  );
}