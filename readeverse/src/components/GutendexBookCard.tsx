'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Image as ImageIcon,
  Plus,
  Check,
  Loader2,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/TranslationContext';

export interface GutendexBook {
  id: number;
  title: string;
  authors: {
    name: string;
    birth_year?: number;
    death_year?: number;
  }[];
  subjects: string[];
  languages: string[];
  formats: Record<string, string>;
  download_count: number;
}

interface GutendexBookCardProps {
  book: GutendexBook;
  onImport?: (bookId: number, title: string) => Promise<void>;
  isImporting?: boolean;
  isImported?: boolean;
}

export default function GutendexBookCard({
  book,
  onImport,
  isImporting = false,
  isImported = false,
}: GutendexBookCardProps) {

  const router = useRouter();

  const { user } = useAuth();

  const { translateText, language, t } = useTranslation();

  const [translatedTitle, setTranslatedTitle] = useState(book.title);

  const [isReading, setIsReading] = useState(false);

  const coverUrl = book.formats['image/jpeg'];

  useEffect(() => {

    let isMounted = true;

    translateText(book.title).then((translated) => {

      if (isMounted) {
        setTranslatedTitle(translated);
      }

    });

    return () => {
      isMounted = false;
    };

  }, [book.title, language, translateText]);

  // READ BOOK INSIDE WEBSITE
  const handleReadBook = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {

    e.preventDefault();

    if (!user) {
      router.push('/signup');
      return;
    }

    try {

      setIsReading(true);

      // IMPORT BOOK INTO DATABASE
      const res = await fetch('/api/books/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gutendexId: book.id,
        }),
      });

      if (!res.ok) {
        let errorMessage = 'Failed to import book';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Import failed (${res.status}): ${res.statusText}`;
        }
        console.error('Import error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await res.json();

      if (!data?.bookId) {
        throw new Error('Book ID not returned');
      }

      // OPEN CUSTOM READER PAGE
      router.push(`/reader/${data.bookId}`);

    } catch (error) {

      console.error('Error opening book:', error);

    } finally {

      setIsReading(false);

    }

  };

  const handleImportClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {

    e.preventDefault();

    if (onImport) {
      await onImport(book.id, book.title);
    }

  };

  const authorName =
    book.authors.length > 0
      ? book.authors[0].name
          .split(',')
          .reverse()
          .join(' ')
          .trim()
      : 'Unknown Author';

  // CLEAN SUBJECT TAGS
  const subjects = book.subjects
    .map((s) => s.split('--')[0].trim())
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 2);

  return (

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-full"
    >

      {/* COVER */}
      <div className="relative aspect-[2/3] w-full bg-gray-100 overflow-hidden flex items-center justify-center">

        {coverUrl ? (

          <img
            src={coverUrl}
            alt={translatedTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

        ) : (

          <div className="flex flex-col items-center justify-center text-gray-400">

            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />

            <span className="text-sm font-medium">
              No Cover
            </span>

          </div>

        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">

          {/* ADD TO LIBRARY */}
          {onImport && (

            <button
              onClick={handleImportClick}
              disabled={isImporting || isImported}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
            >

              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : isImported ? (
                <>
                  <Check className="w-4 h-4" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {t('add_to_library') || 'Add to Library'}
                </>
              )}

            </button>

          )}

          {/* READ BOOK */}
          <button
            onClick={handleReadBook}
            disabled={isReading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 px-4 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >

            {isReading ? (

              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Opening...
              </>

            ) : (

              <>
                <BookOpen className="w-4 h-4" />
                {t('read_book') || 'Read Book'}
              </>

            )}

          </button>

        </div>

      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-3">

          {subjects.map((subject, idx) => (

            <span
              key={idx}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
            >
              {subject}
            </span>

          ))}

          {book.languages.map((lang, idx) => (

            <span
              key={`lang-${idx}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 uppercase"
            >
              {lang}
            </span>

          ))}

        </div>

        {/* TITLE */}
        <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {translatedTitle}
        </h3>

        {/* AUTHOR */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-1">
          {authorName}
        </p>

        {/* FOOTER */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">

          <span>
            {book.download_count.toLocaleString()} downloads
          </span>

        </div>

      </div>

    </motion.div>

  );

}