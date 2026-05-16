import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const result = await executeQuery(
      'SELECT * FROM "Match" ORDER BY "matchDate" DESC'
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET MATCHES ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, opponent, matchDate, location, matchType, result, score } =
      await req.json();

    if (!name || !opponent || !matchDate) {
      return NextResponse.json(
        { error: "Name, opponent, and date are required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    await executeQuery(
      'INSERT INTO "Match" (id, name, opponent, "matchDate", location, "matchType", result, score) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [id, name, opponent, matchDate, location || null, matchType, result || null, score || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[CREATE MATCH ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
