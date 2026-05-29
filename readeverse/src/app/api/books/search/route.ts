import { NextRequest, NextResponse } from 'next/server';
import { searchBooks } from '@/services/databaseService';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const results = await searchBooks(query, Math.min(limit, 100));

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: error.message || 'Search failed' },
      { status: 500 }
    );
  }
}
