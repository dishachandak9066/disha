import axios from 'axios';

import {
  saveBook,
  saveChapters,
  getBookByGutendexId,
} from '@/services/databaseService';

/**
 * Clean Gutenberg text
 */
function cleanText(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Count words
 */
function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Split into chapters
 */
function splitIntoChapters(text: string) {
  const regex =
    /(?:CHAPTER|Chapter)\s+([0-9IVXLC]+)/g;

  const matches = [...text.matchAll(regex)];

  // fallback if no chapters
  if (matches.length === 0) {
    return [
      {
        chapterNumber: 1,
        title: 'Full Book',
        content: text,
        wordCount: countWords(text),
      },
    ];
  }

  const chapters = [];

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index || 0;

    const end =
      i + 1 < matches.length
        ? matches[i + 1].index
        : text.length;

    const content = text
      .slice(start, end)
      .trim();

    chapters.push({
      chapterNumber: i + 1,
      title: `Chapter ${i + 1}`,
      content,
      wordCount: countWords(content),
    });
  }

  return chapters;
}

/**
 * Import books
 */
async function importBooks() {
  try {
    console.log('Fetching books...');

    const response = await axios.get(
      'https://gutendex.com/books/?languages=en'
    );

    const books = response.data.results;

    for (const item of books) {
      try {
        console.log(
          `\nProcessing: ${item.title}`
        );

        // avoid duplicates
        const existingBook =
          await getBookByGutendexId(item.id);

        if (existingBook) {
          console.log('Already imported');
          continue;
        }

        // get text URL
        const textUrl =
          item.formats[
            'text/plain; charset=utf-8'
          ] ||
          item.formats['text/plain'];

        if (!textUrl) {
          console.log('No text URL');
          continue;
        }

        // download book
        const textResponse =
          await axios.get(textUrl);

        let rawText = textResponse.data;

        rawText = cleanText(rawText);

        // split chapters
        const chapters =
          splitIntoChapters(rawText);

        const totalWords =
          countWords(rawText);

        // save metadata
        const bookId = await saveBook({
          gutendexId: item.id,
          title: item.title,
          author:
            item.authors?.[0]?.name ||
            'Unknown',
          coverImage:
            item.formats['image/jpeg'] ||
            null,
          language:
            item.languages?.[0] || 'en',
          subjects: item.subjects || [],
          downloadCount:
            item.download_count || 0,
          textUrl,
          totalChapters: chapters.length,
          totalWords,
        });

        // save chapters
        await saveChapters(
          bookId,
          chapters
        );

        console.log(
          `Saved "${item.title}" with ${chapters.length} chapters`
        );
      } catch (bookError) {
        console.error(
          'Book import failed:',
          item.title,
          bookError
        );
      }
    }

    console.log('\nImport completed');
  } catch (error) {
    console.error(
      'Import failed:',
      error
    );
  }

  process.exit();
}

importBooks();