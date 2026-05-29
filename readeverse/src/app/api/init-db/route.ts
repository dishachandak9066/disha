import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/services/databaseService';

export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true, message: 'Database initialized' });
  } catch (error: any) {
    console.error('Database initialization failed:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to initialize database' },
      { status: 500 }
    );
  }
}
