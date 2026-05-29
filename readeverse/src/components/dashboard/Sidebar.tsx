'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Library,
  Headphones,
  Sparkles,
  TrendingUp,
  Heart,
  Clock,
  User,
  Settings,
  LogOut,
  FileText
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/TranslationContext';

const mainLinks = [
  { key: 'home', href: '/dashboard', icon: Home },
  { key: 'my_library', href: '/dashboard/library', icon: Library },
  { key: 'audiobooks', href: '/dashboard/audiobooks', icon: Headphones },
];

const discoverLinks = [
  { key: 'for_you', href: '/dashboard/foryou', icon: Sparkles },
  { key: 'trending', href: '/dashboard/trending', icon: TrendingUp },
  { key: 'ai_summaries', href: '/dashboard/summaries', icon: FileText },
];

const personalLinks = [
  { key: 'favorites', href: '/dashboard/favorites', icon: Heart },
  { key: 'history', href: '/dashboard/history', icon: Clock },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { t } = useTranslation();

  const renderLinks = (links: any[]) => (
    <div className="space-y-1.5">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.key}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-primary/15 text-primary font-medium'
                : 'text-gray-600 hover:text-primary hover:bg-gray-50'
            }`}
          >
            <Icon
              className={`w-5 h-5 ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            />

            <span className="text-sm">
              {t(link.key)}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside className="w-72 fixed inset-y-0 left-0 bg-white border-r border-gray-200 flex flex-col z-50">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-3 group">

          <div className="p-1 rounded-xl group-hover:bg-primary/10 transition-colors">
            <img
              src="/logo.png"
              alt="Read-E-Verse Logo"
              className="w-9 h-9 object-contain"
            />
          </div>

          <span className="text-xl font-bold tracking-wide text-gray-900">
            READ-E-
            <span className="text-primary">
              VERSE
            </span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-5 overflow-y-auto scrollbar-hide">

        <div className="mb-7">
          <p className="px-4 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            {t('menu')}
          </p>

          {renderLinks(mainLinks)}
        </div>

        <div className="mb-7">
          <p className="px-4 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            {t('discover')}
          </p>

          {renderLinks(discoverLinks)}
        </div>

        <div className="mb-4">
          <p className="px-4 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
            {t('personal')}
          </p>

          {renderLinks(personalLinks)}
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-100">
        <div className="space-y-1.5">

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:text-primary hover:bg-gray-50"
          >
            <User className="w-5 h-5" />

            <span className="text-sm">
              {t('profile')}
            </span>
          </Link>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-gray-600 hover:text-primary hover:bg-gray-50"
          >
            <Settings className="w-5 h-5" />

            <span className="text-sm">
              {t('settings')}
            </span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />

            <span className="text-sm">
              {t('sign_out')}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}