'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, BookOpen } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { apiFetch } from '@/lib/api';

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  cover?: string;
  progress?: number;
  category?: string;
  description?: string;
  dateAdded?: string;
  lastAccessed?: string;
}

interface LibraryBookCardProps {
  book: LibraryBook;
  initialFavorite?: boolean;
  onToggleFavorite?: (id: string, isFav: boolean) => void;
}

export default function LibraryBookCard({
  book,
  initialFavorite = false,
  onToggleFavorite,
}: LibraryBookCardProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const { t } = useTranslation();

  const isCompleted = (book.progress ?? 0) === 100;

  const openReader = () => {
    router.push(`/reader/${book.id}`);
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const newFav = !isFavorite;
    setIsFavorite(newFav);

    if (onToggleFavorite) onToggleFavorite(book.id, newFav);

    try {
      if (newFav) {
        // Add to user library
        await apiFetch('/api/library/books', {
          method: 'POST',
          data: { bookId: parseInt(book.id) },
        });
      } else {
        // Note: Python backend doesn't have a remove endpoint yet
        // This would need to be implemented in the backend
        console.warn('Remove from library endpoint not yet implemented');
      }
    } catch (err) {
      console.error(err);
      setIsFavorite(!newFav);
    }
  };

  return (
    <div 
      onClick={openReader}
      className="glass p-4 rounded-2xl group hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      <div className={`aspect-[2/3] w-full rounded-xl bg-gradient-to-br ${book.cover || 'from-purple-900 to-indigo-900'} shadow-lg relative overflow-hidden mb-4 flex items-center justify-center`}>
        {book.cover ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50">{book.title}</div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-white/50 p-4 text-center font-semibold">{book.title}</div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-3">
           <button
             onClick={(e) => { e.stopPropagation(); openReader(); }}
             className="px-4 py-2 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 cursor-pointer gap-2"
           >
             <BookOpen className="w-4 h-4 text-white" />
             <span className="text-white text-sm font-semibold">Read</span>
           </button>
        </div>
        
        <button 
          onClick={handleFavoriteToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${isFavorite ? 'bg-pink-500/20 text-pink-500' : 'bg-black/30 text-white hover:bg-black/50'}`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors text-white">{book.title}</h3>
        <p className="text-gray-400 text-sm mb-1">{book.author}</p>
        <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10 font-medium">
            {book.category || 'General'}
          </span>
        </div>
        {book.description && (
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">{book.description}</p>
        )}
        
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-medium mb-1.5">
            <span className="text-gray-400">{isCompleted ? t('completed') : t('progress')}</span>
            <span className={isCompleted ? 'text-emerald-500' : 'text-primary'}>
              {book.progress || 0}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary to-purple-500'}`}
              style={{ width: `${book.progress || 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}