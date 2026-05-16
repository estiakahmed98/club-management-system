import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM "Tournament" ORDER BY "startDate" DESC LIMIT 100'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Tournaments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, location, entryFee, totalPrize, description } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDatabase();
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO "Tournament" (id, name, "startDate", "endDate", location, "entryFee", "totalPrize", description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())',
      [id, name, startDate, endDate, location || null, entryFee || 0, totalPrize || 0, description || null]
    );

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('Tournament creation error:', error);
    return NextResponse.json({ error: 'Failed to create tournament' }, { status: 500 });
  }
}
