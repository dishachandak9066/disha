import { NextRequest, NextResponse } from 'next/server';
import {
  getBookWithChapters,
  getChapters,
} from '@/services/databaseService';

export async function GET(
  req: NextRequest,
<<<<<<< HEAD
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

=======
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
>>>>>>> 4cfe8dc35fe86aa5e1041d7d8813be16785316fd
    const bookId = parseInt(id);

    if (isNaN(bookId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid book ID',
        },
        {
          status: 400,
        }
      );
    }

    const searchParams =
      req.nextUrl.searchParams;

    const startChapter =
      searchParams.get('startChapter');

    const endChapter =
      searchParams.get('endChapter');

    // Specific chapter range
    if (startChapter && endChapter) {
      const chapters = await getChapters(
        bookId,
        parseInt(startChapter),
        parseInt(endChapter)
      );

      return NextResponse.json({
        success: true,
        chapters,
      });
    }

    // Full book
    const book =
      await getBookWithChapters(bookId);

    if (!book) {
      return NextResponse.json(
        {
          success: false,
          error: 'Book not found',
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      book,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          'Failed to fetch book',
      },
      {
        status: 500,
      }
    );
  }
}