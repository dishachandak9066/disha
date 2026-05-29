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

        const res = await apiFetch('/api/books');

        setBooks(res.data || []);

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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">

        <div>

          <h1 className="text-3xl font-bold mb-2">
            {t('my_library')}
          </h1>

          <p className="text-gray-400">
            {t('manage_books')}
          </p>

        </div>

        {/* SEARCH + VIEW */}
        <div className="flex items-center gap-3 w-full md:w-auto">

          {/* SEARCH */}
          <div className="relative flex-1 md:w-80">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

          </div>

          {/* VIEW TOGGLE */}
          <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">

            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
            </button>

          </div>

        </div>

      </div>

      {/* IMPORTED LIBRARY */}
      <section className="mb-16">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl font-bold">
            Your Books
          </h2>

          <span className="text-sm text-gray-500">
            {filteredBooks.length} books
          </span>

        </div>

        {loading ? (

          <div className="flex items-center justify-center py-20">

            <Loader2 className="w-8 h-8 animate-spin text-primary" />

          </div>

        ) : filteredBooks.length === 0 ? (

          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">

            <h3 className="text-xl font-semibold mb-2">
              No books yet
            </h3>

            <p className="text-gray-500">
              Import books from Gutenberg below ✨
            </p>

          </div>

        ) : (

          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                : 'flex flex-col gap-4'
            }
          >

            {filteredBooks.map((book) => (

              <LibraryBookCard
                key={book.id}
                book={book}
                viewMode={viewMode}
              />

            ))}

          </div>

        )}

      </section>

      {/* GUTENDEX SECTION */}
      <section>

        <div className="mb-6">

          <h2 className="text-2xl font-bold mb-2">
            Explore Gutenberg
          </h2>

          <p className="text-gray-500">
            Discover and import free books
          </p>

        </div>

        <div className="rounded-3xl overflow-hidden">

          <GutendexBooks />

        </div>

      </section>

    </div>

  );

}