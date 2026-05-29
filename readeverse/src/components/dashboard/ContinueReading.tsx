'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

interface ContinueReadingProps {
  book: {
    title: string;
    author: string;
    cover: string;
    progress: number;
    timeLeft: string;
  } | null;
}

export default function ContinueReading({ book }: ContinueReadingProps) {
  const { t } = useTranslation();

  if (!book) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{t('continue_reading')}</h2>
      <div className="glass p-6 rounded-2xl flex flex-col sm:flex-row gap-6 items-center">
        {/* Mock Book Cover */}
        <div className={`w-32 h-48 rounded-xl bg-gradient-to-br ${book.cover} shadow-lg flex-shrink-0 relative overflow-hidden group cursor-pointer`}>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center pl-1">
              <Play className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-2xl font-bold mb-1">{book.title}</h3>
              <p className="text-gray-400">{book.author}</p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 bg-white/10 rounded-full text-gray-300">
              {book.timeLeft} {t('left')}
            </span>
          </div>

          <div className="mt-8">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-gray-400">{t('progress')}</span>
              <span className="text-primary">{book.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full"
                style={{ width: `${book.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 py-2.5 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors">
              {t('resume_reading')}
            </button>
            <button className="px-5 py-2.5 glass hover:bg-white/10 font-medium rounded-xl transition-colors">
              {t('details')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
