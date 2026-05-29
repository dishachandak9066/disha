import { NextRequest, NextResponse } from 'next/server';
import { getBookWithChapters } from '@/services/databaseService';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = Number(params.id);

  // Validate ID
  if (Number.isNaN(bookId)) {
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

  try {
    console.log('BOOK ID:', bookId);

    // Fetch from DB
    const book = await getBookWithChapters(bookId);

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

    console.log('TEXT URL:', book.textUrl);

    // If chapters already exist in DB
    if (
      Array.isArray(book.chapters) &&
      book.chapters.length > 0
    ) {
      return NextResponse.json({
        success: true,
        book,
      });
    }

    // No chapters + no text URL
    if (!book.textUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'No chapters and no text URL available',
        },
        {
          status: 404,
        }
      );
    }

    // Fetch Gutenberg raw text
    const response = await fetch(book.textUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'text/plain',
      },
      cache: 'no-store',
    });

    console.log('FETCH STATUS:', response.status);

    // Gutenberg fetch failed
    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch book content (${response.status})`,
        },
        {
          status: 502,
        }
      );
    }

    // Read text
    const content = await response.text();

    // Empty content check
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Book content is empty',
        },
        {
          status: 500,
        }
      );
    }

    // Return raw text
    return NextResponse.json({
      success: true,
      book: {
        ...book,
        chapters: [],
        rawText: content,
      },
    });

  } catch (error: any) {
    console.error('Fetch book content failed:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message || 'Failed to load book content',
      },
      {
        status: 500,
      }
    );
  }
}