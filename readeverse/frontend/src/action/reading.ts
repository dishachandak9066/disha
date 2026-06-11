'use server';

import { apiFetch } from '@/lib/api';

export async function saveReadingProgress(
  userId: string,
  bookId: number,
  progress: number,
  currentChapter: number
) {
  try {
    await apiFetch('/api/reading-progress', {
      method: 'POST',
      data: {
        bookId,
        progress,
        currentChapter
      },
      headers: {
        'user_email': userId
      }
    });
  } catch (error) {
    console.error('Failed to save reading progress via FastAPI:', error);
  }
}