  'use server';

  import { pool } from '@/services/databaseService';

  export interface DashboardStats {
    booksFinished: number;
    readingHours: number;
    currentlyReading: number;
    favoriteBooks: number;
    audiobookHours: number;
    readingStreak: number;
  }

  export async function getDashboardStats(
    userId: string
  ): Promise<DashboardStats> {
    try {
      const connection = await pool.getConnection();

      const [finished]: any = await connection.execute(
        `
        SELECT COUNT(*) as count
        FROM user_library
        WHERE userId = ?
        AND progress >= 100
        `,
        [userId]
      );

      const [reading]: any = await connection.execute(
        `
        SELECT COUNT(*) as count
        FROM user_library
        WHERE userId = ?
        AND progress > 0
        AND progress < 100
        `,
        [userId]
      );

      connection.release();

      return {
        booksFinished: finished[0].count,
        currentlyReading: reading[0].count,
        favoriteBooks: 0,
        readingHours: 0,
        audiobookHours: 0,
        readingStreak: 0,
      };
    } catch (error) {
      console.error(error);

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