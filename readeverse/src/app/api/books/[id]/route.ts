import { NextRequest, NextResponse } from 'next/server';
import { getBookWithChapters, getChapters } from '@/services/databaseService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json({ error: 'Invalid book ID' }, { status: 400 });
    }

    // Check if requesting specific chapters
    const searchParams = req.nextUrl.searchParams;
    const startChapter = searchParams.get('startChapter');
    const endChapter = searchParams.get('endChapter');

    if (startChapter && endChapter) {
      // Get specific chapter range
      const chapters = await getChapters(
        bookId,
        parseInt(startChapter),
        parseInt(endChapter)
      );

      if (!chapters || chapters.length === 0) {
        return NextResponse.json(
          { error: 'Chapters not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: chapters,
      });
    }

    // Get full book with all chapters
    const book = await getBookWithChapters(bookId);

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: book,
    });
  } catch (error: any) {
    console.error('Error fetching book:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch book' },
      { status: 500 }
    );
  }
}
