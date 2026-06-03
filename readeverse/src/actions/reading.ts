'use server';

import { updateReadingProgress } from '@/services/databaseService';

export async function saveReadingProgress(
  userId: string,
  bookId: number,
  progress: number,
  currentChapter: number
) {
  await updateReadingProgress(
    userId,
    bookId,
    progress,
    currentChapter
  );
}