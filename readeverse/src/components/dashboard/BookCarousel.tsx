import React from 'react';
import { Play, Headphones } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
}

interface BookCarouselProps {
  title: string;
  books: Book[];
  isAudiobook?: boolean;
}

export default function BookCarousel({
  title,
  books,
  isAudiobook = false,
}: BookCarouselProps) {
  return (
    <div className="mb-10">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>

        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          See All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            className="group cursor-pointer"
          >
            <div className="aspect-[2/3] w-full rounded-xl shadow-lg relative overflow-hidden mb-3 bg-gray-800">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center pl-1 hover:bg-white/30 transition-colors hover:scale-110">
                  <Play className="w-5 h-5 text-white fill-white" />
                </button>
              </div>

              {isAudiobook && (
                <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-md rounded-lg">
                  <Headphones className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <h3 className="font-bold text-sm md:text-base text-white line-clamp-1 group-hover:text-primary transition-colors">
              {book.title}
            </h3>

            <p className="text-gray-400 text-xs md:text-sm line-clamp-1">
              {book.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}