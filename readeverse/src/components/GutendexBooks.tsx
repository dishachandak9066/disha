'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import GutendexBookCard, { GutendexBook } from './GutendexBookCard';
import { useTranslation } from '@/context/TranslationContext';

export default function GutendexBooks() {
  const { t } = useTranslation();
  const [books, setBooks] = useState<GutendexBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [seeding, setSeeding] = useState(false);

  // Fetch books from YOUR DATABASE instead of Gutendex
  const fetchBooks = async (pageNum: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/books/popular?page=${pageNum}&limit=20`);
      if (!res.ok) throw new Error('Failed to fetch books from database');
      
      const data = await res.json();
      
      // Transform database books to match GutendexBook format
      const transformedBooks = (data.data || []).map((dbBook: any) => ({
        id: dbBook.gutendexId || dbBook.id,
        title: dbBook.title,
        authors: [{ name: dbBook.author }],
        subjects: dbBook.subjects || [],
        languages: [dbBook.language],
        formats: {
          'image/jpeg': dbBook.coverImage || '',
          'text/plain': dbBook.textUrl || '',
        },
        download_count: dbBook.downloadCount || 0,
      }));
      
      setBooks(transformedBooks);
      setTotalPages(data.pagination?.totalPages || 1);
      setPage(pageNum);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching books.');
    } finally {
      setLoading(false);
    }
  };

  // Seed books from Gutendex into your database
  const handleSeedBooks = async () => {
    try {
      setSeeding(true);
      setError(null);
      const lang = category || 'en';
      const seedPage = page;
      
      const res = await fetch(`/api/seed-books?lang=${lang}&page=${seedPage}`);
      if (!res.ok) throw new Error('Failed to seed books');
      
      const data = await res.json();
      alert(`✅ Seeded ${data.savedCount} books, ${data.skippedCount} already existed`);
      
      // Refresh the display
      await fetchBooks(1);
    } catch (err: any) {
      setError(err.message || 'Failed to seed books from Gutendex');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled via database search, not here
    // For now, just refetch with page 1
    fetchBooks(1);
  };

  const handleCategorySelect = (newCat: string) => {
    setCategory(newCat);
    // When category changes, reset to page 1
    fetchBooks(1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchBooks(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchBooks(page - 1);
    }
  };

  const categories = [
    { value: '', label: 'All Books' },
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
  ];

  return (
    <section className="py-10 md:py-12" id="explore-books">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header with Seed Button */}
        <div className="flex flex-col gap-6 mb-10">
          
          {/* Title and Seed Button */}
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Library Books</h2>
            <button
              onClick={handleSeedBooks}
              disabled={seeding}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-4 py-2.5 rounded-xl font-medium transition-all"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Seeding...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Seed Books from Gutenberg
                </>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search_books') || 'Search books...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm transition-all"
            />
          </form>

          {/* Language Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((c) => {
              const isActive = category === c.value;
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleCategorySelect(c.value)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* State: Error */}
        {error && (
          <div className="flex items-center gap-3 p-4 mb-8 bg-red-50 text-red-600 rounded-xl border border-red-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* State: Empty / Loading Initial */}
        {loading && books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading books...</p>
          </div>
        ) : !loading && books.length === 0 && !error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books yet</h3>
            <p className="text-gray-500 max-w-md">Click "Seed Books from Gutenberg" to add books to your library.</p>
          </div>
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {books.map((book, i) => (
                <GutendexBookCard 
                  key={`${book.id}-${i}`} 
                  book={book}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || loading}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
              >
                ← Previous
              </button>
              <span className="text-gray-600 font-medium">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages || loading}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all"
              >
                Next →
              </button>
            </div>
          </>
        )}

      </div>
    </section>
  );
} 
