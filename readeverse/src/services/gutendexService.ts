'use server';

import { cache } from 'react';

export interface GutendexBook {
  id: number;
  title: string;
  authors: Array<{ name: string }>;
  cover_image: string | null;
  download_count: number;
  language: string[];
  subjects: string[];
  formats: {
    [key: string]: string;
  };
}

export interface BookMetadata {
  gutendexId: number;
  title: string;
  author: string;
  coverImage: string | null;
  language: string;
  subjects: string[];
  downloadCount: number;
  textUrl: string;
}

export interface BookChapter {
  id: string;
  bookId: number;
  chapterNumber: number;
  title: string;
  content: string;
  wordCount: number;
}

// Cache for 1 hour
export const fetchGutendexBooks = cache(async (search?: string, topic?: string, page = 1) => {
  let url = 'https://gutendex.com/books?';
  const params = new URLSearchParams();

  if (search) params.append('search', search);
  if (topic) params.append('topic', topic);
  params.append('page', page.toString());

  url += params.toString();

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) throw new Error('Failed to fetch from Gutendex');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Gutendex API error:', error);
    throw error;
  }
});

export async function getBookMetadata(gutendexId: number): Promise<BookMetadata | null> {
  try {
    const response = await fetch(`https://gutendex.com/books/${gutendexId}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });
    
    if (!response.ok) return null;
    
    const book: GutendexBook = await response.json();

    // Find text URL (prefer plain text, then HTML)
    const textUrl = book.formats['text/plain; charset=utf-8'] ||
                    book.formats['text/plain'] ||
                    book.formats['text/html'] ||
                    null;

    if (!textUrl) return null;

    return {
      gutendexId: book.id,
      title: book.title,
      author: book.authors?.[0]?.name || 'Unknown Author',
      coverImage: book.cover_image,
      language: book.language?.[0] || 'en',
      subjects: book.subjects || [],
      downloadCount: book.download_count,
      textUrl,
    };
  } catch (error) {
    console.error('Error fetching book metadata:', error);
    return null;
  }
}

/**
 * Downloads and parses plain text content from Gutenberg
 * Returns the raw text content
 */
export async function downloadBookContent(textUrl: string): Promise<string> {
  try {
    const response = await fetch(textUrl);
    if (!response.ok) throw new Error(`Failed to fetch content from ${textUrl}`);
    
    const text = await response.text();
    
    // Remove Project Gutenberg header and footer
    const cleaned = removeGutenbergMetadata(text);
    return cleaned;
  } catch (error) {
    console.error('Error downloading book content:', error);
    throw error;
  }
}

/**
 * Removes standard Gutenberg header/footer from text
 */
function removeGutenbergMetadata(text: string): string {
  // Remove header (up to "*** START OF")
  let cleaned = text.replace(/^[\s\S]*?\*{3,}\s*START[^\n]*\n/i, '');
  
  // Remove footer (from "*** END OF")
  cleaned = cleaned.replace(/\*{3,}\s*END[^\s\S]*$/i, '');
  
  // Remove excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned.trim();
}

/**
 * Intelligently chunks book content
 * Tries to preserve chapter/section breaks
 */
export async function chunkBookContent(
  content: string,
  chunkSize: number = 5000
): Promise<Array<{ title: string; content: string }>> {
  const chunks: Array<{ title: string; content: string }> = [];
  
  // Split by common chapter markers
  const chapters = content.split(/CHAPTER|PART|SECTION|BOOK/i);
  
  let currentChunk = '';
  let chapterNum = 0;

  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i].trim();
    
    if (!chapter) continue;

    // If adding this chapter would exceed chunkSize, save current chunk
    if (currentChunk.length + chapter.length > chunkSize && currentChunk.length > 0) {
      chapterNum++;
      chunks.push({
        title: `Chapter ${chapterNum}`,
        content: currentChunk.trim(),
      });
      currentChunk = '';
    }

    currentChunk += (currentChunk ? '\n\n' : '') + chapter;
  }

  // Add remaining content
  if (currentChunk.length > 0) {
    chapterNum++;
    chunks.push({
      title: `Chapter ${chapterNum}`,
      content: currentChunk.trim(),
    });
  }

  // If no chapters found, split by fixed size
  if (chunks.length === 0) {
    const paragraphs = content.split(/\n\n+/);
    let chunk = '';

    for (const para of paragraphs) {
      if (chunk.length + para.length > chunkSize && chunk.length > 0) {
        chapterNum++;
        chunks.push({
          title: `Chapter ${chapterNum}`,
          content: chunk.trim(),
        });
        chunk = '';
      }
      chunk += (chunk ? '\n\n' : '') + para;
    }

    if (chunk.length > 0) {
      chapterNum++;
      chunks.push({
        title: `Chapter ${chapterNum}`,
        content: chunk.trim(),
      });
    }
  }

  return chunks;
}

/**
 * Count words in text
 */
export async function countWords(text: string): Promise<number> {
  return text.trim().split(/\s+/).length;
}

/**
 * Complete book import process
 */
export async function importBook(gutendexId: number) {
  try {
    // Get metadata
    const metadata = await getBookMetadata(gutendexId);
    if (!metadata) throw new Error('Could not fetch book metadata');

    // Download content
    const content = await downloadBookContent(metadata.textUrl);

    // Chunk content
    const chunks =await chunkBookContent(content);

    // Return processed data ready for database storage
    return {
      metadata,
      chapters: await Promise.all(chunks.map(async (chunk, index) => ({
        chapterNumber: index,
        title: chunk.title,
        content: chunk.content,
        wordCount: await countWords(chunk.content),
      }))),
    };
  } catch (error) {
    console.error('Error importing book:', error);
    throw error;
  }
}
