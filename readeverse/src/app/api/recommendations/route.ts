import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Simulate AI processing delay (1.5 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const recommendations = {
    personalized: [
      { id: 'ai1', title: 'Neuromancer', author: 'William Gibson', cover: 'from-cyan-700 to-blue-900', progress: 0, category: 'Books', dateAdded: '', matchScore: 98 },
      { id: 'ai2', title: 'Snow Crash', author: 'Neal Stephenson', cover: 'from-orange-600 to-red-800', progress: 0, category: 'Audiobooks', dateAdded: '', matchScore: 95 },
      { id: 'ai3', title: 'The Martian', author: 'Andy Weir', cover: 'from-red-600 to-orange-700', progress: 0, category: 'Books', dateAdded: '', matchScore: 92 },
      { id: 'ai4', title: 'Exhalation', author: 'Ted Chiang', cover: 'from-gray-700 to-black', progress: 0, category: 'Books', dateAdded: '', matchScore: 89 },
    ],
    trending: [
      { id: 'tr1', title: 'Fourth Wing', author: 'Rebecca Yarros', cover: 'from-slate-700 to-slate-900', progress: 0, category: 'Books', dateAdded: '', matchScore: 85 },
      { id: 'tr2', title: 'Iron Flame', author: 'Rebecca Yarros', cover: 'from-yellow-700 to-orange-900', progress: 0, category: 'Audiobooks', dateAdded: '', matchScore: 82 },
      { id: 'tr3', title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', cover: 'from-pink-700 to-rose-900', progress: 0, category: 'Books', dateAdded: '', matchScore: 78 },
      { id: 'tr4', title: 'Tomorrow, and Tomorrow, and Tomorrow', author: 'Gabrielle Zevin', cover: 'from-blue-400 to-indigo-600', progress: 0, category: 'Books', dateAdded: '', matchScore: 75 },
    ],
    similar: [
      { id: 'sm1', title: 'Sapiens', author: 'Yuval Noah Harari', cover: 'from-amber-600 to-orange-800', progress: 0, category: 'Audiobooks', dateAdded: '', matchScore: 91 },
      { id: 'sm2', title: 'Homo Deus', author: 'Yuval Noah Harari', cover: 'from-indigo-600 to-purple-800', progress: 0, category: 'Books', dateAdded: '', matchScore: 88 },
      { id: 'sm3', title: '21 Lessons for the 21st Century', author: 'Yuval Noah Harari', cover: 'from-emerald-600 to-teal-800', progress: 0, category: 'Books', dateAdded: '', matchScore: 86 },
      { id: 'sm4', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: 'from-blue-500 to-cyan-700', progress: 0, category: 'Audiobooks', dateAdded: '', matchScore: 84 },
    ]
  };

  return NextResponse.json(recommendations);
}
