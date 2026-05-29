import { NextRequest, NextResponse } from 'next/server';
import { books, audiobooks, users, userFavorites, userHistory, calculateStats } from '@/lib/mockData';

// Helper to check token (mock)
function getUserIdFromRequest(req: NextRequest): string | null {
  const cookieUser = req.cookies.get('readeverse_user')?.value;
  if (cookieUser) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieUser));
      return parsed.id;
    } catch (e) {}
  }
  return 'u1779420122638'; // fallback to Bob Tester if not found, to keep things working
}

export async function GET(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  
  if (pathname === '/api/books') {
    return NextResponse.json({ success: true, data: books });
  }
  
  if (pathname.startsWith('/api/books/')) {
    const id = pathname.split('/').pop();
    const book = books.find(b => b.id === id);
    if (book) return NextResponse.json({ success: true, data: book });
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  if (pathname === '/api/audiobooks') {
    return NextResponse.json({ success: true, data: audiobooks });
  }

  if (pathname.startsWith('/api/audiobooks/')) {
    const id = pathname.split('/').pop();
    const book = audiobooks.find(a => a.id === id);
    if (book) return NextResponse.json({ success: true, data: book });
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  }

  if (pathname === '/api/favorites') {
    const userId = getUserIdFromRequest(req);
    const favIds = userFavorites[userId!] || [];
    const allLibrary = [...books, ...audiobooks];
    const myFavorites = allLibrary.filter(b => favIds.includes(b.id));
    return NextResponse.json({ success: true, data: myFavorites });
  }

  if (pathname === '/api/history') {
    const userId = getUserIdFromRequest(req);
    const history = userHistory[userId!] || [];
    const allLibrary = [...books, ...audiobooks];
    const populatedHistory = history.map(h => ({
      ...h,
      book: allLibrary.find(b => b.id === h.bookId) || null
    }));
    return NextResponse.json({ success: true, data: populatedHistory });
  }

  if (pathname === '/api/recommendations') {
    const allLibrary = [...books, ...audiobooks];
    const trending = [...allLibrary].sort(() => 0.5 - Math.random()).slice(0, 4).map(b => ({ ...b, matchScore: Math.floor(Math.random() * 20) + 80 }));
    let personalized = allLibrary.slice(0, 4).map(b => ({ ...b, matchScore: 95 }));
    let similar = allLibrary.slice(4, 8).map(b => ({ ...b, matchScore: 85 }));
    
    return NextResponse.json({
      success: true,
      data: { personalized, trending, similar }
    });
  }

  if (pathname.startsWith('/api/stats/')) {
    const id = pathname.split('/').pop();
    return NextResponse.json({ success: true, data: calculateStats(id!) });
  }

  if (pathname === '/api/gutendex') {
    const search = searchParams.get('search');
    const topic = searchParams.get('topic');
    const pageUrl = searchParams.get('pageUrl');
    
    let targetUrl = 'https://gutendex.com/books/';
    if (pageUrl) {
      targetUrl = pageUrl;
    } else {
      const qs = new URLSearchParams();
      if (search) qs.append('search', search);
      if (topic) qs.append('topic', topic);
      const queryString = qs.toString();
      if (queryString) targetUrl += `?${queryString}`;
    }
    
    try {
      const gutRes = await fetch(targetUrl);
      const data = await gutRes.json();
      if (data.next) data.next = `/api/gutendex?pageUrl=${encodeURIComponent(data.next)}`;
      if (data.previous) data.previous = `/api/gutendex?pageUrl=${encodeURIComponent(data.previous)}`;
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const body = await req.json().catch(() => ({}));

  if (pathname === '/api/auth/register') {
    const { email, password, name } = body;
    const existingUser = users.find(u => u.email.toLowerCase() === email?.toLowerCase());
    if (existingUser) return NextResponse.json({ success: false, error: 'User already exists', message: 'User already exists' }, { status: 400 });
    
    const newUser = { id: `u${Date.now()}`, email, password, name };
    users.push(newUser);
    return NextResponse.json({ success: true, token: 'mock-jwt-token', user: { id: newUser.id, email: newUser.email, name: newUser.name } }, { status: 201 });
  }

  if (pathname === '/api/auth/login') {
    const { email, password } = body;
    const user = users.find(u => u.email.toLowerCase() === email?.toLowerCase() && u.password === password);
    if (!user) return NextResponse.json({ success: false, error: 'Invalid credentials', message: 'Invalid credentials' }, { status: 401 });
    
    return NextResponse.json({ success: true, token: 'mock-jwt-token', user: { id: user.id, email: user.email, name: user.name } });
  }

  if (pathname.startsWith('/api/favorites/')) {
    const userId = getUserIdFromRequest(req);
    const bookId = pathname.split('/').pop()!;
    if (!userFavorites[userId!]) userFavorites[userId!] = [];
    if (!userFavorites[userId!].includes(bookId)) userFavorites[userId!].push(bookId);
    return NextResponse.json({ success: true, message: 'Added to favorites' });
  }

  if (pathname === '/api/history') {
    const userId = getUserIdFromRequest(req);
    const { bookId, progress } = body;
    if (!userHistory[userId!]) userHistory[userId!] = [];
    
    const existingIndex = userHistory[userId!].findIndex(h => h.bookId === bookId);
    if (existingIndex > -1) {
      userHistory[userId!][existingIndex].progress = progress;
      userHistory[userId!][existingIndex].lastAccessed = new Date().toISOString();
    } else {
      userHistory[userId!].push({ bookId, progress, lastAccessed: new Date().toISOString() });
    }
    return NextResponse.json({ success: true, message: 'History updated' });
  }

  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function DELETE(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/favorites/')) {
    const userId = getUserIdFromRequest(req);
    const bookId = pathname.split('/').pop()!;
    if (userFavorites[userId!]) {
      userFavorites[userId!] = userFavorites[userId!].filter(id => id !== bookId);
    }
    return NextResponse.json({ success: true, message: 'Removed from favorites' });
  }

  if (pathname.startsWith('/api/history/')) {
    const userId = getUserIdFromRequest(req);
    const bookId = pathname.split('/').pop()!;
    if (userHistory[userId!]) {
      userHistory[userId!] = userHistory[userId!].filter(h => h.bookId !== bookId);
    }
    return NextResponse.json({ success: true, message: 'Removed from history' });
  }

  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
