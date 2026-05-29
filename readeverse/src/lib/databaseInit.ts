'use server';

import { initializeDatabase, saveBook, saveChapters } from '@/services/databaseService';

/**
 * Initialize the database - call this once during app startup
 * Can be called from a Next.js API route
 */
export async function initializeGutenbergDatabase() {
  try {
    console.log('Initializing Gutenberg database...');
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Import sample books for testing
 * Gutendex IDs of classic books:
 * - 1342: Pride and Prejudice (Jane Austen)
 * - 1661: Sherlock Holmes (Arthur Conan Doyle)
 * - 4300: Ulysses (James Joyce)
 * - 11: Alice in Wonderland (Lewis Carroll)
 * - 23: Don Quixote (Miguel de Cervantes)
 * - 1342: Pride and Prejudice (Jane Austen)
 */
export async function importSampleBooks() {
  try {
    const { importBook } = await import('@/services/gutendexService');

    const sampleBooks = [
      { id: 1342, name: 'Pride and Prejudice' },
      { id: 1661, name: 'The Sherlock Holmes Collection' },
      { id: 11, name: 'Alice in Wonderland' },
      { id: 23, name: 'Don Quixote' },
    ];

    console.log('🔄 Importing sample books...');

    for (const book of sampleBooks) {
      try {
        console.log(`Importing: ${book.name}...`);
        const { metadata, chapters } = await importBook(book.id);

        const totalWords = chapters.reduce((sum, ch) => sum + ch.wordCount, 0);

        const bookId = await saveBook({
          ...metadata,
          totalChapters: chapters.length,
          totalWords,
        });

        await saveChapters(bookId, chapters);

        console.log(
          `✅ Imported: ${metadata.title} (${chapters.length} chapters, ${totalWords} words)`
        );
      } catch (error) {
        console.error(`⚠️  Failed to import ${book.name}:`, error);
      }
    }

    console.log('Sample books import complete');
    return { success: true };
  } catch (error) {
    console.error('Sample import failed:', error);
    throw error;
  }
}

/**
 * Quick health check - verify database connection and tables
 */
export async function healthCheck() {
  try {
    const { pool } = await import('@/services/databaseService');
    const connection = await pool.getConnection();

    const [books] = await connection.execute('SELECT COUNT(*) as count FROM books');
    const [chapters] = await connection.execute(
      'SELECT COUNT(*) as count FROM book_chapters'
    );
    const [userLib] = await connection.execute(
      'SELECT COUNT(*) as count FROM user_library'
    );

    connection.release();

    const stats = {
      books: (books as any[])[0].count,
      chapters: (chapters as any[])[0].count,
      userLibraryEntries: (userLib as any[])[0].count,
    };

    console.log('✅ Database health check passed:', stats);
    return { success: true, stats };
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
