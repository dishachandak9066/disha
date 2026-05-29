import { NextRequest, NextResponse } from 'next/server';
import { getBooks } from '@/services/databaseService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid page or limit parameters' },
        { status: 400 }
      );
    }

    const result = await getBooks(page, Math.min(limit, 100));

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
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch books' },
      { status: 500 }
    );
  }
}
