'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Settings, BookOpen, Loader2 } from 'lucide-react';

export interface BookReaderProps {
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  totalChapters: number;
  totalWords: number;
}

interface Chapter {
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
}

export default function BookReader({
  bookId,
  bookTitle,
  bookAuthor,
  totalChapters,
  totalWords,
}: BookReaderProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load book chapters
  useEffect(() => {
    const loadBook = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) throw new Error('Failed to load book');

        const { data } = await res.json();
        setChapters(data.chapters || []);
      } catch (error) {
        console.error('Error loading book:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [bookId]);

  // Update progress in database
  useEffect(() => {
    const updateProgress = async () => {
      if (chapters.length === 0) return;

      const percentRead = ((currentChapter + 1) / totalChapters) * 100;
      setProgress(percentRead);

      try {
        await fetch(`/api/library/books/${bookId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            progress: percentRead,
            currentChapter,
          }),
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    };

    updateProgress();
  }, [currentChapter, bookId, totalChapters]);

  const handlePreviousChapter = useCallback(() => {
    setCurrentChapter(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextChapter = useCallback(() => {
    setCurrentChapter(prev => Math.min(totalChapters - 1, prev + 1));
  }, [totalChapters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-400">Loading book...</p>
        </div>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400">No chapters available</p>
        </div>
      </div>
    );
  }

  const chapter = chapters[currentChapter];
  const contentWords = chapter?.content.split(/\s+/).length || 0;
  const estimatedReadTime = Math.ceil(contentWords / 200); // 200 words per minute

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white line-clamp-1">{bookTitle}</h1>
            <p className="text-sm text-gray-400">{bookAuthor}</p>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Chapter {currentChapter + 1} of {totalChapters}</p>
              <p className="text-xs text-gray-500">~{estimatedReadTime} min read</p>
            </div>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              aria-label="Reader settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="border-t border-gray-800 bg-gray-900/50 px-4 py-4">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Font Size */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Font Size</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFontSize(prev => Math.max(14, prev - 2))}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    A-
                  </button>
                  <span className="text-sm text-gray-400 min-w-[40px] text-center">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(prev => Math.min(28, prev + 2))}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Line Height */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Line Height</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLineHeight(prev => Math.max(1.2, prev - 0.2))}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm text-gray-400 min-w-[40px] text-center">{lineHeight.toFixed(1)}</span>
                  <button
                    onClick={() => setLineHeight(prev => Math.min(2.4, prev + 0.2))}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="h-1 bg-gray-800">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Chapter Title */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">{chapter?.title}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-primary to-transparent rounded" />
        </div>

        {/* Chapter Content */}
        <div
          className="prose prose-invert max-w-none mb-16"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          {chapter?.content.split('\n\n').map((paragraph, idx) => (
            <p
              key={idx}
              className="text-gray-300 mb-6 leading-relaxed"
              style={{ lineHeight: lineHeight }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-12 p-6 bg-gray-800/30 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{contentWords}</p>
            <p className="text-sm text-gray-400">words</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">~{estimatedReadTime}</p>
            <p className="text-sm text-gray-400">min read</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{Math.round(progress)}%</p>
            <p className="text-sm text-gray-400">complete</p>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 bg-gray-950/95 backdrop-blur border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <button
            onClick={handlePreviousChapter}
            disabled={currentChapter === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 text-gray-300 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {/* Chapter Navigation */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              Chapter {currentChapter + 1} of {totalChapters}
            </span>
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: Math.min(5, totalChapters) }).map((_, i) => {
                const chapterNum = Math.floor((i * totalChapters) / 5);
                const isActive = currentChapter === chapterNum;
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentChapter(chapterNum)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-primary w-6' : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Jump to chapter ${chapterNum + 1}`}
                  />
                );
              })}
            </div>
          </div>

          <button
            onClick={handleNextChapter}
            disabled={currentChapter === totalChapters - 1}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
