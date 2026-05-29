

import mysql from 'mysql2/promise';
console.log('DATABASE SERVICE LOADED');
// MySQL Connection Pool Configuration
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'disha#lucky1',
  database: process.env.MYSQL_DATABASE || 'readeverse',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Initialize database tables if they don't exist
 */
export async function initializeDatabase() {
  const connection = await pool.getConnection();

  try {
    // Books table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        gutendexId INT UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        coverImage TEXT,
        language VARCHAR(10) DEFAULT 'en',
        subjects JSON,
        downloadCount INT DEFAULT 0,
        textUrl LONGTEXT NOT NULL,
        totalChapters INT DEFAULT 0,
        totalWords INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_gutendexId (gutendexId),
        INDEX idx_title (title),
        INDEX idx_author (author)
      )
    `);

    // Book chapters table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS book_chapters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bookId INT NOT NULL,
        chapterNumber INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content LONGTEXT NOT NULL,
        wordCount INT DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
        UNIQUE KEY unique_chapter (bookId, chapterNumber),
        INDEX idx_bookId (bookId)
      )
    `);

    // User library table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_library (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        bookId INT NOT NULL,
        progress DECIMAL(5, 2) DEFAULT 0,
        currentChapter INT DEFAULT 0,
        lastReadAt TIMESTAMP,
        addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bookId) REFERENCES books(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_book (userId, bookId),
        INDEX idx_userId (userId)
      )
    `);

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Save book metadata to database
 */
export async function saveBook(bookData: {
  gutendexId: number;
  title: string;
  author: string;
  coverImage: string | null;
  language: string;
  subjects: string[];
  downloadCount: number;
  textUrl: string;
  totalChapters: number;
  totalWords: number;
}): Promise<number> {
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO books 
       (
         gutendexId,
         title,
         author,
         coverImage,
         language,
         subjects,
         downloadCount,
         textUrl,
         totalChapters,
         totalWords
       )
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       totalChapters = VALUES(totalChapters),
       totalWords = VALUES(totalWords),
       updatedAt = CURRENT_TIMESTAMP`,
      [
        bookData.gutendexId,
        bookData.title,
        bookData.author,
        bookData.coverImage,
        bookData.language,
        JSON.stringify(bookData.subjects),
        bookData.downloadCount,
        bookData.textUrl,
        bookData.totalChapters,
        bookData.totalWords,
      ]
    );

    // Get inserted/updated book ID
    const [books] = await connection.execute(
      'SELECT id FROM books WHERE gutendexId = ?',
      [bookData.gutendexId]
    );

    return (books as any[])[0].id;
  } finally {
    connection.release();
  }
}

/**
 * Save book chapters
 */
export async function saveChapters(
  bookId: number,
  chapters: Array<{
    chapterNumber: number;
    title: string;
    content: string;
    wordCount: number;
  }>
): Promise<void> {
  if (chapters.length === 0) return;

  const connection = await pool.getConnection();

  try {
    // Remove old chapters
    await connection.execute(
      'DELETE FROM book_chapters WHERE bookId = ?',
      [bookId]
    );

    // Batch insert
    const placeholders = chapters
      .map(() => '(?, ?, ?, ?, ?)')
      .join(',');

    const values: any[] = [];

    for (const chapter of chapters) {
      values.push(
        bookId,
        chapter.chapterNumber,
        chapter.title,
        chapter.content,
        chapter.wordCount
      );
    }

    await connection.execute(
      `INSERT INTO book_chapters
       (bookId, chapterNumber, title, content, wordCount)
       VALUES ${placeholders}`,
      values
    );
  } finally {
    connection.release();
  }
}

/**
 * Get book with chapters
 */
export async function getBookWithChapters(bookId: number) {
  const connection = await pool.getConnection();

  try {
    const [books] = await connection.execute(
      `SELECT
        id,
        gutendexId,
        title,
        author,
        coverImage,
        language,
        subjects,
        downloadCount,
        textUrl,
        totalChapters,
        totalWords
       FROM books
       WHERE id = ?`,
      [bookId]
    );

    if ((books as any[]).length === 0) {
      return null;
    }

    const book = (books as any[])[0];

    try {
  book.subjects = JSON.parse(book.subjects || '[]');
} catch {
  book.subjects = [book.subjects];
}

    const [chapters] = await connection.execute(
      `SELECT
        chapterNumber,
        title,
        content,
        wordCount
       FROM book_chapters
       WHERE bookId = ?
       ORDER BY chapterNumber ASC`,
      [bookId]
    );

    return {
      ...book,
      chapters,
    };
  } finally {
    connection.release();
  }
}

/**
 * Get book by Gutendex ID
 */
export async function getBookByGutendexId(gutendexId: number) {
  const connection = await pool.getConnection();

  try {
    const [books] = await connection.execute(
      'SELECT id FROM books WHERE gutendexId = ?',
      [gutendexId]
    );

    if ((books as any[]).length === 0) {
      return null;
    }

    return (books as any[])[0].id;
  } finally {
    connection.release();
  }
}

/**
 * Get books with pagination
 */
export async function getBooks(
  page: number = 1,
  limit: number = 20
) {
  const connection = await pool.getConnection();

  try {
    const offset = (page - 1) * limit;

    const [books] = await connection.query(
  `SELECT
    id,
    gutendexId,
    title,
    author,
    coverImage,
    language,
    totalChapters,
    totalWords
   FROM books
   ORDER BY updatedAt DESC
   LIMIT ${Number(limit)}
   OFFSET ${Number(offset)}`
);

    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM books'
    );

    return {
      books: books as any[],
      total: (countResult as any[])[0].total,
      page,
      totalPages: Math.ceil(
        (countResult as any[])[0].total / limit
      ),
    };
  } finally {
    connection.release();
  }
}

/**
 * Search books
 */
export async function searchBooks(
  query: string,
  limit: number = 20
) {
  const connection = await pool.getConnection();

  try {
    const searchTerm = `%${query}%`;

    const [books] = await connection.execute(
      `SELECT
        id,
        gutendexId,
        title,
        author,
        coverImage,
        language,
        totalChapters,
        totalWords
       FROM books
       WHERE title LIKE ? OR author LIKE ?
       ORDER BY title ASC
       LIMIT ?`,
      [searchTerm, searchTerm, limit]
    );

    return books as any[];
  } finally {
    connection.release();
  }
}

/**
 * Get chapters
 */
export async function getChapters(
  bookId: number,
  startChapter?: number,
  endChapter?: number
) {
  const connection = await pool.getConnection();

  try {
    let query =
      'SELECT chapterNumber, title, content, wordCount FROM book_chapters WHERE bookId = ?';

    const params: any[] = [bookId];

    if (
      startChapter !== undefined &&
      endChapter !== undefined
    ) {
      query += ' AND chapterNumber BETWEEN ? AND ?';

      params.push(startChapter, endChapter);
    }

    query += ' ORDER BY chapterNumber ASC';

    const [chapters] = await connection.execute(query, params);

    return chapters as any[];
  } finally {
    connection.release();
  }
}

/**
 * Add to user library
 */
export async function addToUserLibrary(
  userId: string,
  bookId: number
) {
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `INSERT INTO user_library (userId, bookId)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
       addedAt = CURRENT_TIMESTAMP`,
      [userId, bookId]
    );
  } finally {
    connection.release();
  }
}

/**
 * Get user library
 */
export async function getUserLibrary(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const connection = await pool.getConnection();

  try {
    const offset = (page - 1) * limit;

    const [books] = await connection.execute(
      `SELECT
        b.id,
        b.gutendexId,
        b.title,
        b.author,
        b.coverImage,
        b.language,
        ul.progress,
        ul.currentChapter,
        ul.lastReadAt
       FROM user_library ul
       JOIN books b ON ul.bookId = b.id
       WHERE ul.userId = ?
       ORDER BY ul.lastReadAt DESC
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as total FROM user_library WHERE userId = ?',
      [userId]
    );

    return {
      books: books as any[],
      total: (countResult as any[])[0].total,
      page,
      totalPages: Math.ceil(
        (countResult as any[])[0].total / limit
      ),
    };
  } finally {
    connection.release();
  }
}

/**
 * Update reading progress
 */
export async function updateReadingProgress(
  userId: string,
  bookId: number,
  progress: number,
  currentChapter: number
) {
  const connection = await pool.getConnection();

  try {
    await connection.execute(
      `UPDATE user_library
       SET
         progress = ?,
         currentChapter = ?,
         lastReadAt = CURRENT_TIMESTAMP
       WHERE userId = ? AND bookId = ?`,
      [progress, currentChapter, userId, bookId]
    );
  } finally {
    connection.release();
  }
}

export { pool };

// Auto initialize database tables
initializeDatabase().catch((err) => {
  console.error('Database initialization failed:', err);
});