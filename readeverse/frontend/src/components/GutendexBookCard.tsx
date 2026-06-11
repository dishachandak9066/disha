'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Download } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export interface GutendexBook {
  id: number;
  title: string;
  authors: { name: string }[];
  subjects: string[];
  languages: string[];
  formats: Record<string, string>;
  download_count: number;
}

interface GutendexBookCardProps {
  book: GutendexBook;
}

export default function GutendexBookCard({ book }: GutendexBookCardProps) {
  const router = useRouter();

  const authorName = book.authors && book.authors.length > 0 ? book.authors[0].name : 'Unknown Author';
  // Try to find a cover image format
  const coverImage = book.formats['image/jpeg'] || book.formats['image/png'] || null;
  const category = book.subjects && book.subjects.length > 0 ? book.subjects[0].split('--')[0].trim() : 'General';

  const openReader = () => {
    // Navigate to reader
    router.push(`/reader/${book.id}`);
  };

  return (
    <div 
      onClick={openReader}
      className="glass p-4 rounded-2xl group hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer bg-white border border-gray-100 shadow-sm h-full"
    >
      <div className="aspect-[2/3] w-full rounded-xl bg-gray-100 shadow-sm relative overflow-hidden mb-4 flex items-center justify-center">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 p-4 text-center font-semibold bg-gradient-to-br from-gray-100 to-gray-200">
            {book.title}
          </div>
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
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors text-gray-900">{book.title}</h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-1">{authorName}</p>
        
        <div className="mt-auto pt-2">
          <div className="flex flex-wrap gap-2 mb-3 text-xs text-gray-500">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium line-clamp-1">
              {category}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {book.download_count?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
