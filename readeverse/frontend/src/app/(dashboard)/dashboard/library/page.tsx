'use client';

import React, { useState, useMemo, useEffect } from 'react';

import {
  Search,
  Grid,
  List,
  Loader2,
} from 'lucide-react';

import LibraryBookCard, {
  LibraryBook,
} from '@/components/dashboard/LibraryBookCard';

import { useTranslation } from '@/context/TranslationContext';

import { apiFetch } from '@/lib/api';

import GutendexBooks from '@/components/GutendexBooks';

export default function LibraryPage() {

  const { t } = useTranslation();

  const [books, setBooks] = useState<LibraryBook[]>([]);

  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // FETCH IMPORTED BOOKS
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await apiFetch('/api/books/popular?page=1&limit=50');
        console.log('Books API Response:', res);
        
        // Map Python backend response to component format
        const mappedBooks = (res.data || []).map((b: any) => ({
          id: String(b.id),
          title: b.title,
          author: b.author || 'Unknown Author',
          cover: b.coverImage || '',
          progress: b.progress || 0,
          category: 'General',
          description: '',
        }));
        
        setBooks(mappedBooks);
      } catch (err) {
        console.error('Failed to fetch books', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // SEARCH FILTER
  const filteredBooks = useMemo(() => {

    let result = [...books];

    if (searchQuery) {

      const q = searchQuery.toLowerCase();

      result = result.filter(

        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q)

      );

    }

    return result;

  }, [books, searchQuery]);

  return (

    <div className="animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 ">

        <div>

          <h1 className="text-3xl font-bold mb-2">
            {t('my_library')}
          </h1>

          <p className="text-gray-400">
            {t('manage_books')}
          </p>

        </div>
      </div>



      {/* GUTENDEX SECTION */}
      <section>
        <div className="rounded-3xl overflow-hidden">

          <GutendexBooks />

        </div>

      </section>

    </div>

  );

}