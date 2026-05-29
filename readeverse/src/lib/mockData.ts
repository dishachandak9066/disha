export const SEED_BOOKS = [
  {
    id: 'b1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover: 'from-blue-600 to-indigo-900',
    category: 'Fiction',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    rating: 4.5,
    dateAdded: '2026-05-01T12:00:00.000Z',
    pages: 304,
    progress: 35
  },
  {
    id: 'b2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    cover: 'from-orange-500 to-red-800',
    category: 'Sci-Fi',
    description: 'Ryland Grace is the sole survivor on a desperate, last-chance mission to save humanity from an extinction-level event.',
    rating: 4.8,
    dateAdded: '2026-05-05T12:00:00.000Z',
    pages: 476,
    progress: 70
  },
  {
    id: 'b3',
    title: 'Zero to One',
    author: 'Peter Thiel',
    cover: 'from-slate-700 to-slate-900',
    category: 'Business',
    description: 'Notes on Startups, or How to Build the Future. Zero to One presents at once an optimistic view of the future of progress and a new way of thinking about innovation.',
    rating: 4.6,
    dateAdded: '2026-05-10T12:00:00.000Z',
    pages: 224,
    progress: 10
  },
  {
    id: 'b4',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover: 'from-yellow-500 to-yellow-700',
    category: 'Self-Help',
    description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. Tiny Changes, Remarkable Results.',
    rating: 4.9,
    dateAdded: '2026-05-15T12:00:00.000Z',
    pages: 320,
    progress: 90
  }
];

export const SEED_AUDIOBOOKS = [
  {
    id: 'a1',
    title: 'Dune',
    author: 'Frank Herbert',
    cover: 'from-yellow-700 to-amber-900',
    category: 'Sci-Fi',
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, who would become the mysterious man known as Muad\'Dib.',
    duration: '21h 02m',
    rating: 4.7,
    dateAdded: '2026-05-02T12:00:00.000Z',
    progress: 15
  },
  {
    id: 'a2',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover: 'from-amber-600 to-orange-800',
    category: 'Fiction',
    description: 'A Brief History of Humankind. Sapiens tackles the biggest questions of history and of the modern world, written in a vivid language.',
    duration: '15h 17m',
    rating: 4.6,
    dateAdded: '2026-05-08T12:00:00.000Z',
    progress: 50
  },
  {
    id: 'a3',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover: 'from-blue-500 to-cyan-700',
    category: 'Business',
    description: 'Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    duration: '20h 02m',
    rating: 4.4,
    dateAdded: '2026-05-12T12:00:00.000Z',
    progress: 0
  },
  {
    id: 'a4',
    title: 'Deep Work',
    author: 'Cal Newport',
    cover: 'from-emerald-700 to-teal-900',
    category: 'Self-Help',
    description: 'Rules for Focused Success in a Distracted World. Deep work is the ability to focus without distraction on a cognitively demanding task.',
    duration: '7h 44m',
    rating: 4.6,
    dateAdded: '2026-05-18T12:00:00.000Z',
    progress: 80
  }
];

export const users: any[] = [
  {
    id: 'u1779420122638',
    email: 'bob@example.com',
    password: 'password123',
    name: 'Bob Tester'
  },
  {
    id: 'u1779420226433',
    email: 'harsh@gmail.com',
    password: 'pass123',
    name: 'harsh'
  },
  {
    id: 'u1779420412432',
    email: 'disha@gmail.com',
    password: 'pass123',
    name: 'disha'
  }
];

export const books: any[] = [...SEED_BOOKS];
export const audiobooks: any[] = [...SEED_AUDIOBOOKS];
export const userFavorites: Record<string, string[]> = {};
export const userHistory: Record<string, any[]> = {};

export function calculateStats(userId: string) {
  const favs = userFavorites[userId] || [];
  const history = userHistory[userId] || [];

  let currentlyReading = history.filter(h => h.progress > 0 && h.progress < 100).length;
  let booksFinished = history.filter(h => h.progress === 100).length;

  if (history.length === 0) {
    currentlyReading = books.filter(b => b.progress > 0 && b.progress < 100).length;
    booksFinished = books.filter(b => b.progress === 100).length;
  }

  const favoriteBooks = favs.length;

  let totalReadingMinutes = 0;
  if (history.length > 0) {
    totalReadingMinutes = history.reduce((acc, h) => acc + (h.progress || 0) * 4, 0);
  } else {
    totalReadingMinutes = books.reduce((acc, b) => acc + (b.progress || 0) * 4, 0);
  }
  const readingHours = Math.max(12, Math.round(totalReadingMinutes / 60));

  let audiobookHours = 8;
  const audiobookHistory = history.filter(h => h.bookId.startsWith('a'));
  if (audiobookHistory.length > 0) {
    audiobookHours = Math.round(audiobookHistory.reduce((acc, h) => acc + (h.progress || 0) * 5, 0) / 60);
  }

  let readingStreak = 0;
  if (history.length > 0) {
    readingStreak = Math.min(30, history.length + 2);
  } else {
    readingStreak = 5;
  }

  return {
    booksFinished,
    readingHours,
    currentlyReading,
    favoriteBooks,
    audiobookHours,
    readingStreak
  };
}
