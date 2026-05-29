'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Heart, MoreHorizontal, BookOpen, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { apiFetch } from '@/lib/api';

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  category: string;
  description: string;
  dateAdded: string;
}

interface LibraryBookCardProps {
  book: LibraryBook;
  viewMode: 'grid' | 'list';
  initialFavorite?: boolean;
  onToggleFavorite?: (id: string, isFav: boolean) => void;
}

export default function LibraryBookCard({ book, viewMode, initialFavorite = false, onToggleFavorite }: LibraryBookCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const { translateText, language, t } = useTranslation();
  const [translatedTitle, setTranslatedTitle] = useState(book.title);
  const [translatedDescription, setTranslatedDescription] = useState(book.description || '');
  const categoryLabel = t(`category_${book.category.toLowerCase().replace(/[\s-]+/g, '_')}`);
  
  const isCompleted = book.progress === 100;

  const openReader = () => {
    if (!book.id) return;
    router.push(`/reader/${book.id}`);
  };

  useEffect(() => {
    let isMounted = true;
    translateText(book.title).then((translated) => {
      if (isMounted) setTranslatedTitle(translated);
    });
    translateText(book.description || '').then((translated) => {
      if (isMounted) setTranslatedDescription(translated);
    });
    return () => {
      isMounted = false;
    };
  }, [book.title, book.description, language, translateText]);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFav = !isFavorite;
    setIsFavorite(newFav);
    
    // Optimistic UI update for the parent component if it cares
    if (onToggleFavorite) onToggleFavorite(book.id, newFav);

    // Persist to backend
    try {
      if (newFav) {
        await apiFetch('/api/favorites', {
          method: 'POST',
          data: book
        });
      } else {
        await apiFetch(`/api/favorites/${book.id}`, {
          method: 'DELETE'
        });
      }
    } catch (err) {
      console.error('Failed to toggle favorite on backend', err);
      // Revert state on failure
      setIsFavorite(!newFav);
      if (onToggleFavorite) onToggleFavorite(book.id, !newFav);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="glass p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-6 group hover:-translate-y-1 transition-all duration-300">
        <div className={`w-24 h-36 rounded-xl bg-gradient-to-br ${book.cover} shadow-lg flex-shrink-0 relative overflow-hidden`}>
           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
             <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center pl-1 hover:bg-white/30 transition-colors">
               <Play className="w-4 h-4 text-white" />
             </button>
           </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{translatedTitle}</h3>
              <p className="text-gray-400 text-sm mb-2">{book.author}</p>
              <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {categoryLabel}</span>
                <span>{t('added')} {new Date(book.dateAdded).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-3 line-clamp-2">{translatedDescription}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-pink-500 bg-pink-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-gray-400">{isCompleted ? t('completed') : t('progress')}</span>
                <span className={isCompleted ? 'text-emerald-500' : 'text-primary'}>
                  {book.progress}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-purple-500'}`}
                  style={{ width: `${book.progress}%` }}
                />
              </div>
            </div>
            <button
              onClick={openReader}
              className={`w-full sm:w-auto px-6 py-2 rounded-xl text-sm font-medium transition-colors ${isCompleted ? 'glass hover:bg-white/10 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {isCompleted ? t('read_again') : t('continue')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="glass p-4 rounded-2xl group hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className={`aspect-[2/3] w-full rounded-xl bg-gradient-to-br ${book.cover} shadow-lg relative overflow-hidden mb-4`}>
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-3">
           <button
             onClick={openReader}
             className="w-12 h-12 rounded-full bg-primary flex items-center justify-center pl-1 hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95"
           >
             <Play className="w-5 h-5 text-white" />
           </button>
        </div>
        
        <button 
          onClick={handleFavoriteToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${isFavorite ? 'bg-pink-500/20 text-pink-500' : 'bg-black/30 text-white hover:bg-black/50'}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">{translatedTitle}</h3>
        <p className="text-gray-400 text-sm mb-1">{book.author}</p>
        <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {categoryLabel}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{translatedDescription}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-gray-400">{isCompleted ? t('completed') : t('progress')}</span>
            <span className={isCompleted ? 'text-emerald-500' : 'text-primary'}>
              {book.progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-purple-500'}`}
              style={{ width: `${book.progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
