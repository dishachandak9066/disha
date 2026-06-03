import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateReadingProgress } from '@/services/databaseService';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
  bookId,
  progress,
  currentChapter,
} = await req.json();

console.log('Progress API called:', {
  email: session.user.email,
  bookId,
  progress,
  currentChapter,
});

await updateReadingProgress(
  session.user.email,
  bookId,
  progress,
  currentChapter
);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  }
}