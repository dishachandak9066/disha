import { apiFetch } from '@/lib/api';

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
    const data = await apiFetch('/api/dashboard');
    return data.stats;
  } catch (error) {
    console.error('Failed to fetch dashboard stats from FastAPI:', error);
    return {
      booksFinished: 0,
      readingHours: 0,
      currentlyReading: 0,
      favoriteBooks: 0,
      audiobookHours: 0,
      readingStreak: 0,
    };
  }
}
