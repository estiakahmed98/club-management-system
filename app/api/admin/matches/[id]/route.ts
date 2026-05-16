import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await executeQuery('DELETE FROM "Match" WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE MATCH ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, opponent, matchDate, location, matchType, result, score } =
      await req.json();

    if (!name || !opponent) {
      return NextResponse.json(
        { error: "Name and opponent are required" },
        { status: 400 }
      );
    }

    await executeQuery(
      'UPDATE "Match" SET name = $1, opponent = $2, "matchDate" = $3, location = $4, "matchType" = $5, result = $6, score = $7, "updatedAt" = NOW() WHERE id = $8',
      [name, opponent, matchDate, location || null, matchType, result || null, score || null, params.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPDATE MATCH ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}
