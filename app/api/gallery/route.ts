import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    
    // Fetch all gallery items
    const result = await db.query(
      'SELECT id, title, "imageUrl", description, "eventId", "matchId", "tournamentId" FROM "GalleryItem" ORDER BY "createdAt" DESC LIMIT 100'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}
