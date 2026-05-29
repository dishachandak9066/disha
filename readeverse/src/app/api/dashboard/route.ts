import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate database delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const dashboardData = {
    stats: {
      booksRead: 42,
      readingHours: 128,
      readingStreak: 14,
      goalProgress: 75,
    },
    continueReading: {
      id: '1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      cover: 'from-blue-600 to-violet-600',
      progress: 68,
      timeLeft: '2h 15m',
    },
    recommended: [
      { id: '2', title: 'Project Hail Mary', author: 'Andy Weir', cover: 'from-orange-500 to-red-600' },
      { id: '3', title: 'Dune', author: 'Frank Herbert', cover: 'from-yellow-700 to-orange-800' },
      { id: '4', title: 'Dark Matter', author: 'Blake Crouch', cover: 'from-slate-700 to-black' },
      { id: '5', title: 'Neuromancer', author: 'William Gibson', cover: 'from-emerald-500 to-teal-700' },
    ],
    audiobooks: [
      { id: '6', title: 'Atomic Habits', author: 'James Clear', cover: 'from-yellow-400 to-yellow-600' },
      { id: '7', title: 'Sapiens', author: 'Yuval Noah Harari', cover: 'from-amber-600 to-orange-700' },
      { id: '8', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', cover: 'from-blue-400 to-blue-600' },
    ],
  };

  return NextResponse.json(dashboardData);
}
