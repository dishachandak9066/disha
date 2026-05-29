import React from 'react';
import {
  Book,
  Clock,
  Flame,
  Headphones,
  Heart,
  BookOpen,
} from 'lucide-react';

export default function StatsCards() {

  // Default values = 0
  const items = [
    {
      label: 'Books Finished',
      value: 0,
      icon: Book,
      color: 'text-blue-600',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Reading Hours',
      value: 0,
      icon: Clock,
      color: 'text-purple-600',
      bg: 'bg-purple-400/10',
    },
    {
      label: 'Currently Reading',
      value: 0,
      icon: BookOpen,
      color: 'text-emerald-600',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Favorite Books',
      value: 0,
      icon: Heart,
      color: 'text-pink-600',
      bg: 'bg-pink-400/10',
    },
    {
      label: 'Audiobook Hours',
      value: 0,
      icon: Headphones,
      color: 'text-amber-600',
      bg: 'bg-amber-400/10',
    },
    {
      label: 'Reading Streak',
      value: '0 Days',
      icon: Flame,
      color: 'text-orange-600',
      bg: 'bg-orange-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="glass p-5 rounded-2xl hover:-translate-y-1 transition-all duration-300"
          >

            {/* Icon */}
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.bg}`}
            >
              <Icon className={`w-5 h-5 ${item.color}`} />
            </div>

            {/* Value */}
            <h3 className="text-2xl font-bold mb-1 text-white">
              {item.value}
            </h3>

            {/* Label */}
            <p className="text-gray-400 text-sm">
              {item.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}