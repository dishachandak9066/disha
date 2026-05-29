import { NextRequest, NextResponse } from 'next/server';
import {
  getBookByGutendexId,
  saveBook,
  saveChapters,
} from '@/services/databaseService';

/**
 * Clean Gutenberg headers and footers
 */
function cleanGutenbergText(text: string): string {
  return text
    .replace(/\*\*\* START OF THE PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i, '')
    .replace(/\*\*\* END OF THE PROJECT GUTENBERG EBOOK[\s\S]*?\*\*\*/i, '')
    .trim();
}

/**
 * Split book into chapters
 */
function parseChapters(text: string) {
  const chapterRegex =
    /(?:CHAPTER|Chapter)\s+([A-Z0-9IVXLC]+)([\s\S]*?)(?=(?:CHAPTER|Chapter)\s+[A-Z0-9IVXLC]+|$)/g;

  const chapters = [];
  let match;
  let chapterNumber = 1;

  while ((match = chapterRegex.exec(text)) !== null) {
    const content = match[0].trim();

    if (content.length < 500) continue;

    chapters.push({
      chapterNumber,
      title: `Chapter ${chapterNumber}`,
      content,
      wordCount: content.split(/\s+/).length,
    });

    chapterNumber++;
  }

  // Fallback if no chapters found
  if (chapters.length === 0) {
    const chunks = text.match(/[\s\S]{1,5000}/g) || [];

    return chunks.map((chunk, index) => ({
      chapterNumber: index + 1,
      title: `Part ${index + 1}`,
      content: chunk,
      wordCount: chunk.split(/\s+/).length,
    }));
  }

  return chapters;
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const lang = searchParams.get('lang') || 'en';
  const page = parseInt(searchParams.get('page') || '1', 10) || 1;

  const url = `https://gutendex.com/books/?languages=${encodeURIComponent(
    lang
  )}&page=${encodeURIComponent(String(page))}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Gutendex fetch failed with status ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const books = Array.isArray(data.results) ? data.results : [];

    const saved: number[] = [];
    const skipped: number[] = [];

    for (const book of books) {
      try {
        const gutendexId = Number(book.id);

        if (Number.isNaN(gutendexId)) continue;

        // Skip existing books
        const existingId = await getBookByGutendexId(gutendexId);

        if (existingId) {
          skipped.push(gutendexId);
          continue;
        }

        const author =
          Array.isArray(book.authors) && book.authors.length > 0
            ? book.authors[0].name || 'Unknown Author'
            : 'Unknown Author';

        // Get best text format
        const textUrl =
          book.formats?.['text/plain; charset=utf-8'] ||
          book.formats?.['text/plain'] ||
          book.formats?.['text/html'] ||
          null;

        if (!textUrl) continue;

        // Download full book text
        const textResponse = await fetch(textUrl);

        if (!textResponse.ok) {
          console.error(`Failed to fetch text for book ${gutendexId}`);
          continue;
        }

        const rawText = await textResponse.text();

        // Clean Gutenberg junk
        const cleanedText = cleanGutenbergText(rawText);

        // Parse chapters
        const chapters = parseChapters(cleanedText);

        const totalWords = cleanedText.split(/\s+/).length;

        // Save book metadata
        const bookId = await saveBook({
          gutendexId,
          title: book.title || 'Untitled',
          author,
          coverImage: book.formats?.['image/jpeg'] || null,
          language: Array.isArray(book.languages)
            ? book.languages[0] || 'unknown'
            : 'unknown',
          subjects: Array.isArray(book.subjects)
            ? book.subjects
            : [],
          downloadCount: Number(book.download_count) || 0,
          textUrl,
          totalChapters: chapters.length,
          totalWords,
        });

        // Save chapters into database
        await saveChapters(bookId, chapters);

        saved.push(gutendexId);

        console.log(
          `Imported: ${book.title} (${chapters.length} chapters)`
        );
      } catch (bookError) {
        console.error('Error importing book:', bookError);
      }
    }

    return NextResponse.json({
      success: true,
      savedCount: saved.length,
      skippedCount: skipped.length,
      saved,
      skipped,
    });
  } catch (error: any) {
    console.error('Seed books failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to seed books',
      },
      { status: 500 }
    );
  }
}