'use client';

import React from 'react';
import { User as UserIcon, Mail, Calendar, Sparkles, BookOpen, Clock, Flame, Target, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  const joinedLabel = (() => {
    const rawId = user?.id;
    if (!rawId) return 'Joined recently';

    const match = /^u(\d+)$/.exec(rawId);
    if (!match) return 'Joined recently';

    const timestamp = Number(match[1]);
    if (!Number.isFinite(timestamp)) return 'Joined recently';

    const joinedDate = new Date(timestamp);
    if (Number.isNaN(joinedDate.getTime())) return 'Joined recently';

    return `Joined ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(joinedDate)}`;
  })();

  return (
    <div className="animate-in fade-in duration-500 pb-20">

      {/* User Header */}
      <div className="glass rounded-3xl p-6 md:p-10 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none -mt-20 -mr-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-pink-500 p-1 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full bg-[#09090b] rounded-full flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white mb-3">
              <Sparkles className="w-3 h-3 text-primary" />
              Pro Member
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{user?.name || 'Reader'}</h1>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-gray-400 text-sm mb-6">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email || 'reader@example.com'}
              </div>
              <div className="hidden md:block w-1 h-1 bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {joinedLabel}
              </div>
            </div>

            <div className="flex gap-4 justify-center md:justify-start" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Right Column (Badges) */}
        <div className="space-y-8">
          
          {/* Achievements */}
          <div className="glass rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Recent Badges</h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">View All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: 'Night Owl', desc: 'Read past midnight', icon: Star, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
                { name: 'Bookworm', desc: 'Read 10 books in a month', icon: BookOpen, color: 'text-pink-400', bg: 'bg-pink-400/10' },
                { name: '7-Day Streak', desc: 'Read every day for a week', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-400/10' },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.bg}`}>
                      <Icon className={`w-6 h-6 ${badge.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{badge.name}</h4>
                      <p className="text-xs text-gray-400">{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
