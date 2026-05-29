'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/TranslationContext';

export default function WelcomeBanner() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Greeting based on time
  const hour = new Date().getHours();

  let greeting = t('good_evening');

  if (hour < 12) {
    greeting = t('good_morning');
  } else if (hour < 18) {
    greeting = t('good_afternoon');
  }

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-7 mb-4 border border-white/10 bg-gradient-to-r from-primary/15 to-purple-900/10 backdrop-blur-xl">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-primary/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium text-white mb-3">
          <Sparkles className="w-3.5 h-3.5 text-primary" />

          <span>
            {t('ai_ready')}
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight text-white">
          {greeting},{' '}

          <span className="text-gradient">
            {user?.name || 'Reader'}
          </span>{' '}
          👋
        </h1>

        {/* Description */}
        <p className="text-gray-700 max-w-2xl text-base md:text-lg leading-relaxed">
          Welcome back to your personalized reading space.
        </p>
      </div>
    </div>
  );
}