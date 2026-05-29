import { NextRequest, NextResponse } from 'next/server';
import { importBook } from '@/services/gutendexService';
import { saveBook, saveChapters, getBookByGutendexId } from '@/services/databaseService';

export const maxDuration = 300; // 5 minutes timeout for large books

// Simple in-memory cache for when DB is unavailable
const importedBooksCache = new Map<number, any>();

export async function POST(req: NextRequest) {
  try {
    const { gutendexId } = await req.json();

    if (!gutendexId || typeof gutendexId !== 'number') {
      return NextResponse.json(
        { error: 'Valid gutendexId is required' },
        { status: 400 }
      );
    }

    // Check cache first
    if (importedBooksCache.has(gutendexId)) {
      const cached = importedBooksCache.get(gutendexId);
      return NextResponse.json(
        {
          success: true,
          message: 'Book cached',
          bookId: cached.bookId,
          title: cached.title,
          author: cached.author,
        },
        { status: 200 }
      );
    }

    // Check if book already imported in DB
    let existingBookId;
    try {
      existingBookId = await getBookByGutendexId(gutendexId);
      if (existingBookId) {
        return NextResponse.json(
          {
            success: true,
            message: 'Book already imported',
            bookId: existingBookId,
          },
          { status: 200 }
        );
      }
    } catch (dbCheckError) {
      console.warn('Database check failed, using cache fallback:', dbCheckError);
    }

    // Import book from Gutendex
    let metadata;
    let chapters;
    try {
      const result = await importBook(gutendexId);
      metadata = result.metadata;
      chapters = result.chapters;
    } catch (importError: any) {
      console.error('Gutendex import failed:', importError);
      return NextResponse.json(
        { error: `Failed to fetch from Gutenberg: ${importError.message}` },
        { status: 502 }
      );
    }

    // Calculate total words
    const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

    // Try to save to database
    let bookId: number | null = null;
    let dbAvailable = true;

    try {
      bookId = await saveBook({
        ...metadata,
        totalChapters: chapters.length,
        totalWords,
      });

      // Save chapters to database
      try {
        await saveChapters(bookId, chapters);
      } catch (chaptersError: any) {
        console.warn('Could not save chapters to database:', chaptersError);
        // Still proceed with bookId
      }
    } catch (dbError: any) {
      console.warn('Database unavailable, using fallback:', dbError);
      dbAvailable = false;
      // Generate a temporary ID based on gutendexId
      bookId = parseInt(`${gutendexId}${Date.now().toString().slice(-6)}`);
    }

    // Cache the book data for this session
    importedBooksCache.set(gutendexId, {
      bookId,
      title: metadata.title,
      author: metadata.author,
      metadata,
      chapters,
    });

    return NextResponse.json(
      {
        success: true,
        message: dbAvailable ? 'Book imported successfully' : 'Book loaded (database offline)',
        bookId,
        title: metadata.title,
        author: metadata.author,
        totalChapters: chapters.length,
        totalWords,
        dbAvailable,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import book' },
      { status: 500 }
    );
  }
}
