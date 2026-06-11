'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, History, Trash2, Clock, Loader2 } from 'lucide-react';
import LibraryBookCard, { LibraryBook } from '@/components/dashboard/LibraryBookCard';
import { apiFetch } from '@/lib/api';

interface HistoryItem extends LibraryBook {
  lastAccessed: string;
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiFetch('/api/history');
        console.log('History API Response:', res);
        // Map Python backend response to component format
        const mapped = (res || []).map((h: any) => ({
          id: String(h.bookId || h.id),
          title: h.title,
          author: h.author || 'Unknown Author',
          cover: h.coverImage || '',
          progress: h.progress || 0,
          category: 'General',
          description: '',
          dateAdded: h.lastAccessed,
          lastAccessed: new Date(h.lastAccessed || Date.now()).toLocaleString(),
        }));

        setHistory(mapped);
      } catch (err) {
        console.error('Failed to fetch history', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    if (!searchQuery) return history;
    const q = searchQuery.toLowerCase();
    return history.filter(
      b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  const handleClearHistory = async () => {
    // In a real app we would call DELETE /api/history
    // Since we don't have a clear all endpoint yet, we'll just clear the local state
    setHistory([]);
    setShowConfirmClear(false);
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reading History</h1>
          <p className="text-gray-400">Pick up right where you left off</p>
        </div>
      </div>

      <div className="relative mb-8 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your reading history..."
          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : filteredHistory.length > 0 ? (
        <div className="relative pl-6 md:pl-8 border-l-2 border-white/10 space-y-10">
          {filteredHistory.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline Dot */}
              <div className="absolute -left-[35px] md:-left-[43px] top-6 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(139,92,246,0.5)] border-4 border-[#09090b]" />
              
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-primary ml-2">
                <Clock className="w-4 h-4" />
                {item.lastAccessed}
              </div>
              
              <div>
                  <h3>{item.title}</h3>
                  <p>{item.author}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center glass rounded-3xl border-dashed border-2 border-white/10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No history found</h3>
          <p className="text-gray-400 max-w-sm">
            {history.length === 0 
              ? "You haven't read anything yet. Head to your library to get started!"
              : "No history items match your search."}
          </p>
        </div>
      )}
    </div>
  );
}
