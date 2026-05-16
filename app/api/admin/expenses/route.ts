import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const result = await db.query(
      'SELECT * FROM "Expense" ORDER BY "expenseDate" DESC LIMIT 100'
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Expenses fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, category, description } = body;
    const userId = request.cookies.get('userId')?.value;

    if (!userId || !amount || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDatabase();
    const id = uuidv4();
    
    await db.query(
      'INSERT INTO "Expense" (id, "userId", amount, category, description, "expenseDate", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())',
      [id, userId, parseFloat(amount), category, description]
    );

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error('Expense creation error:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}
