import { NextRequest, NextResponse } from 'next/server';
import { addToUserLibrary, getUserLibrary, updateReadingProgress } from '@/services/databaseService';

function getUserIdFromRequest(req: NextRequest): string {
  const cookieUser = req.cookies.get('readeverse_user')?.value;
  if (cookieUser) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieUser));
      return parsed.id;
    } catch (e) {}
  }
  return 'u1779420122638'; // fallback
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await getUserLibrary(userId, page, Math.min(limit, 100));

    return NextResponse.json({
      success: true,
      data: result.books,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching user library:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch library' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json(
        { error: 'bookId is required' },
        { status: 400 }
      );
    }

    await addToUserLibrary(userId, bookId);

    return NextResponse.json({
      success: true,
      message: 'Book added to library',
    });
  } catch (error: any) {
    console.error('Error adding to library:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add book' },
      { status: 500 }
    );
  }
}
