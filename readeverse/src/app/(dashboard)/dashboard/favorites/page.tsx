'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, HeartOff, Loader2 } from 'lucide-react';
import LibraryBookCard, { LibraryBook } from '@/components/dashboard/LibraryBookCard';
import { apiFetch } from '@/lib/api';

const CATEGORIES = ['All', 'Books', 'Audiobooks'];

export default function FavoritesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [favorites, setFavorites] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await apiFetch('/api/favorites');
        setFavorites(res.data || []);
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // Handle unfavoriting from a card
  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    if (!isFav) {
      // Small timeout to allow the heart animation to play before unmounting
      setTimeout(() => {
        setFavorites(prev => prev.filter(book => book.id !== id));
      }, 300);
      try {
        await apiFetch(`/api/favorites/${id}`, { method: 'DELETE' });
      } catch (err) {
         console.error('Failed to unfavorite item', err);
      }
    }
  };

  const filteredFavorites = useMemo(() => {
    let result = [...favorites];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== 'All') {
      result = result.filter(b => b.category === activeCategory);
    }

    return result;
  }, [favorites, searchQuery, activeCategory]);

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Favorites</h1>
        <p className="text-gray-400">Your most loved books and audiobooks</p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your favorites..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex bg-white/5 rounded-xl border border-white/10 p-1 min-w-max">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredFavorites.map(book => (
            <LibraryBookCard 
              key={book.id} 
              book={book} 
              viewMode="grid" 
              initialFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center glass rounded-3xl border-dashed border-2 border-white/10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <HeartOff className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No favorites found</h3>
          <p className="text-gray-400 max-w-sm">
            {favorites.length === 0 
              ? "You haven't added any books to your favorites yet. Start exploring!"
              : "No favorites match your current filters."}
          </p>
        </div>
      )}
    </div>
  );
}
