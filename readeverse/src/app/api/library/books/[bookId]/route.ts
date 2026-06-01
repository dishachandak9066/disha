import { NextRequest, NextResponse } from 'next/server';
import { updateReadingProgress } from '@/services/databaseService';

function getUserIdFromRequest(req: NextRequest): string {
  const cookieUser = req.cookies.get('readeverse_user')?.value;
  if (cookieUser) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieUser));
      return parsed.id;
    } catch (e) {}
  }
  return 'u1779420122638'; // fallback
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const userId = getUserIdFromRequest(req);
    const { bookId } = await params;
    const { progress, currentChapter } = await req.json();

    if (typeof progress !== 'number' || typeof currentChapter !== 'number') {
      return NextResponse.json(
        { error: 'progress and currentChapter are required numbers' },
        { status: 400 }
      );
    }

    await updateReadingProgress(userId, parseInt(bookId), progress, currentChapter);

    return NextResponse.json({
      success: true,
      message: 'Progress updated',
    });
  } catch (error: any) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}
