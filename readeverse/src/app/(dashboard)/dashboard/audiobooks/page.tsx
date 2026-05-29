'use client';

import React, { useEffect, useState } from 'react';
import { Play, Headphones, Clock, Star, Pause, Loader2 } from 'lucide-react';
import { useAudioPlayer, AudiobookTrack } from '@/context/AudioPlayerContext';
import { useTranslation } from '@/context/TranslationContext';
import { apiFetch } from '@/lib/api';

export default function AudiobooksPage() {
  const { playTrack, currentTrack, isPlaying, togglePlayPause } = useAudioPlayer();
  const { t } = useTranslation();
  
  const [audiobooks, setAudiobooks] = useState<AudiobookTrack[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<AudiobookTrack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [audioRes, historyRes] = await Promise.all([
          apiFetch('/api/audiobooks'),
          apiFetch('/api/history')
        ]);
        
        setAudiobooks(audioRes.data || []);
        
        // Filter history for audiobooks if applicable, or just take first 2
        const historyAudio = (historyRes.data || []).filter((h: any) => h.category === 'Audiobooks' || h.duration);
        setRecentlyPlayed(historyAudio.length > 0 ? historyAudio.slice(0, 4) : audioRes.data.slice(0, 2));

      } catch (err) {
        console.error('Failed to fetch audiobooks data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePlay = (track: AudiobookTrack) => {
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  };

  const isTrackPlaying = (id: string) => currentTrack?.id === id && isPlaying;

  const renderCard = (track: AudiobookTrack, isLarge = false) => (
    <div key={track.id} className="group cursor-pointer" onClick={() => handlePlay(track)}>
      <div className={`${isLarge ? 'aspect-square' : 'aspect-[2/3]'} w-full rounded-2xl bg-gradient-to-br ${track.cover || 'from-gray-600 to-gray-800'} shadow-lg relative overflow-hidden mb-4 transition-transform duration-300 group-hover:-translate-y-1`}>
        <div className={`absolute inset-0 bg-black/40 ${isTrackPlaying(track.id) ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4`}>
           <button className="w-14 h-14 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95">
             {isTrackPlaying(track.id) ? (
               <div className="flex gap-1 w-5 h-5 justify-center items-center">
                 <div className="w-1.5 h-full bg-white animate-pulse" />
                 <div className="w-1.5 h-full bg-white animate-pulse delay-75" />
               </div>
             ) : (
               <Play className="w-6 h-6 text-white pl-1" />
             )}
           </button>
        </div>
        
        <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-md rounded-lg">
          <Headphones className="w-4 h-4 text-white" />
        </div>
        
        {isLarge && (
          <div className="absolute bottom-3 left-3 flex gap-2">
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white">
              <Clock className="w-3 h-3 text-primary" /> {Math.round((track.duration || 3600) / 60)}m
            </span>
            <span className="flex items-center gap-1 text-xs font-medium px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-white">
              <Star className="w-3 h-3 text-yellow-400 fill-current" /> 4.8
            </span>
          </div>
        )}
      </div>
      <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">{track.title}</h3>
      <p className="text-gray-400 text-sm">{track.author}</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">{t('audiobooks')}</h1>
        <p className="text-gray-400">{t('audiobooks_desc')}</p>
      </div>

      {/* Featured / Hero Section */}
      <div className="glass rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 shadow-2xl shadow-primary/30 relative overflow-hidden z-10 transform transition-transform group-hover:scale-105 duration-500">
           <div className="absolute inset-0 bg-black/20" />
           <Headphones className="absolute inset-0 m-auto w-20 h-20 text-white/50" />
        </div>

        <div className="flex-1 z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/30">
            {t('exclusive_original')}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('ai_revolution')}</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto md:mx-0">
            {t('ai_revolution_desc')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button 
              onClick={() => handlePlay({ id: 'featured', title: t('ai_revolution'), author: 'Read-E-Verse Originals', cover: 'from-purple-600 to-indigo-800', duration: 12000 })}
              className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              {isTrackPlaying('featured') ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              {isTrackPlaying('featured') ? t('pause_listening') : t('start_listening')}
            </button>
            <button className="w-full sm:w-auto px-8 py-3.5 glass hover:bg-white/10 font-bold rounded-xl transition-colors">
              {t('view_details')}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Recently Played */}
          {recentlyPlayed.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{t('jump_back_in')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recentlyPlayed.map(track => renderCard(track, true))}
              </div>
            </div>
          )}

          {/* Explore */}
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('trending_audiobooks')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {audiobooks.map(track => renderCard(track))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
