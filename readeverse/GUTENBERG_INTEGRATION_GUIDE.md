# Gutendex API Integration - Setup Guide

## Overview

This implementation integrates Project Gutenberg's Gutendex API with a MySQL database for storing books locally. Users can browse Gutendex, import books into the database, and read them in-app with support for content chunking for optimal performance.

## Key Features

✅ **Full Gutendex API Integration**
- Fetches complete book metadata (title, author, cover image, language, subjects, download count)
- Downloads and processes plain text content from Project Gutenberg
- Intelligent content chunking for fast loading

✅ **MySQL Database Storage**
- Stores all book metadata and content chapters
- Efficient indexing for fast retrieval
- User library management with progress tracking

✅ **In-App Book Reader**
- Read books directly inside the app (no redirects to Gutenberg)
- Customizable font size and line height
- Chapter navigation and progress tracking
- Reading statistics (words, estimated time)

✅ **User Features**
- Import books from Gutendex to personal library
- Track reading progress per book and chapter
- View library with sorting and filtering

## Architecture

### Services

**`gutendexService.ts`** - Gutendex API Integration
- `fetchGutendexBooks()` - Search and browse books
- `getBookMetadata()` - Extract full book information
- `downloadBookContent()` - Download and clean text
- `chunkBookContent()` - Split content into chapters
- `importBook()` - Complete import workflow

**`databaseService.ts`** - MySQL Operations
- Book management (save, retrieve, search)
- Chapter storage and retrieval
- User library management
- Reading progress tracking

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/books/import` | POST | Import book from Gutendex |
| `/api/books` | GET | List all books (paginated) |
| `/api/books/[id]` | GET | Get book with chapters |
| `/api/books/search` | GET | Search books by title/author |
| `/api/books/popular` | GET | List popular books |
| `/api/library/books` | GET/POST | User's library |
| `/api/library/books/[bookId]` | PUT | Update reading progress |

### Components

**`BookReader.tsx`** - In-app book reader with:
- Chapter navigation
- Font size/line height customization
- Progress tracking
- Reading statistics

**`GutendexBooks.tsx`** - Browse and import Gutendex books

**`GutendexBookCard.tsx`** - Book card with import button

## Environment Setup

### 1. Install Dependencies

```bash
npm install mysql2
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=readeverse
```

### 3. Create MySQL Database

```sql
CREATE DATABASE IF NOT EXISTS readeverse;
USE readeverse;
```

The database tables will be created automatically on first API call.

### 4. Alternative: MySQL Connection String

If using a connection string:

```env
DATABASE_URL=mysql://user:password@localhost:3306/readeverse
```

## Usage Examples

### Import a Book from Gutendex

```javascript
// Browser
const response = await fetch('/api/books/import', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ gutendexId: 1342 }) // Pride and Prejudice
});
const data = await response.json();
// { success: true, bookId: 1, title: "Pride and Prejudice", ... }
```

### Get Book with All Chapters

```javascript
const response = await fetch('/api/books/1');
const { data: book } = await response.json();
// { 
//   id: 1, 
//   title: "...",
//   chapters: [ { chapterNumber, title, content, wordCount }, ... ]
// }
```

### Get Specific Chapter Range

```javascript
const response = await fetch('/api/books/1?startChapter=0&endChapter=5');
const { data: chapters } = await response.json();
```

### Search Books

```javascript
const response = await fetch('/api/books/search?q=Austen&limit=20');
const { data: books, count } = await response.json();
```

### Update Reading Progress

```javascript
const response = await fetch('/api/library/books/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    progress: 45.5,  // 45.5% complete
    currentChapter: 3
  })
});
```

## Database Schema

### books table
- `id` - Primary key
- `gutendexId` - Unique Gutendex ID
- `title` - Book title
- `author` - Primary author
- `coverImage` - Cover image URL
- `language` - Language code (e.g., 'en')
- `subjects` - JSON array of topics
- `downloadCount` - Download count from Gutendex
- `textUrl` - Direct URL to plain text file
- `totalChapters` - Number of chapters
- `totalWords` - Total word count

### book_chapters table
- `id` - Primary key
- `bookId` - Foreign key to books
- `chapterNumber` - Chapter index (0-based)
- `title` - Chapter title/heading
- `content` - Full chapter text
- `wordCount` - Words in chapter

### user_library table
- `userId` - User identifier
- `bookId` - Foreign key to books
- `progress` - Reading progress (0-100%)
- `currentChapter` - Current chapter index
- `lastReadAt` - Last read timestamp

## Performance Considerations

### Content Chunking
- Books are automatically split into chapters
- Typical chunk size: 5000 words
- Fallback: Paragraph-based splitting if no chapter markers found

### Caching
- Gutendex API responses cached for 1 hour
- Book metadata cached for 24 hours
- Database queries use indexes for fast retrieval

### Database Optimization
- Indexes on `gutendexId`, `title`, `author`
- Efficient pagination (20 items per page default)
- Content stored in `LONGTEXT` for large texts

## Limitations & Notes

1. **Plain Text Only** - Currently handles only plain text downloads. HTML/EPUB formats available as alternatives.

2. **Language Support** - Focuses on English books but supports Gutendex's language filtering.

3. **Large Books** - Very large books may take time to import/process. API timeout set to 5 minutes.

4. **Content Quality** - Gutenberg content quality varies. Some OCR texts may have errors.

5. **Metadata** - Some books lack complete metadata (cover images, subjects). These are optional fields.

## Troubleshooting

### Database Connection Error
- Check MySQL is running: `mysql.server status`
- Verify credentials in `.env.local`
- Ensure database exists: `CREATE DATABASE readeverse;`

### Import Timeout
- Large books may exceed default timeout
- API timeout is set to 5 minutes (300000ms)
- Try importing smaller books first

### Missing Chapters
- Not all books have structured chapter markers
- Content will be split by paragraphs if needed
- Minimum chapter size: 1000 words

### No Cover Image
- Some Gutendex books lack cover images
- App shows placeholder if missing
- Covers can be added manually later

## Future Enhancements

- [ ] Support for EPUB and other formats
- [ ] Advanced text processing (OCR correction)
- [ ] Collaborative annotations and highlights
- [ ] Reading recommendations based on history
- [ ] Export reading statistics
- [ ] Integration with user accounts
- [ ] Batch book imports
- [ ] Full-text search with stemming

## File Structure

```
src/
├── services/
│   ├── gutendexService.ts       # Gutendex API integration
│   └── databaseService.ts       # MySQL operations
├── components/
│   ├── BookReader.tsx           # Book reading interface
│   ├── GutendexBooks.tsx        # Browse/import interface
│   └── GutendexBookCard.tsx     # Book card component
└── app/api/
    └── books/
        ├── import/route.ts      # POST import endpoint
        ├── [id]/route.ts        # GET book endpoint
        ├── search/route.ts      # GET search endpoint
        └── popular/route.ts     # GET list endpoint
```

## References

- **Gutendex API**: https://gutendex.com/
- **Project Gutenberg**: https://www.gutenberg.org/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Next.js API Routes**: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Last Updated**: May 2026
**Status**: Production Ready
