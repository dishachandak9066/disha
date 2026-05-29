'use server';

import { calculateStats } from '@/lib/mockData';

export interface DashboardStats {
  booksFinished: number;
  readingHours: number;
  currentlyReading: number;
  favoriteBooks: number;
  audiobookHours: number;
  readingStreak: number;
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  try {
    return calculateStats(userId);
  } catch (error) {
    console.error("Error calculating dashboard stats locally:", error);
    return {
      booksFinished: 0,
      readingHours: 12,
      currentlyReading: 4,
      favoriteBooks: 0,
      audiobookHours: 8,
      readingStreak: 5,
    };
  }
}
