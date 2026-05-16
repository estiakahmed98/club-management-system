import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { matchId, userId } = await req.json();

    if (!matchId || !userId) {
      return NextResponse.json(
        { error: "Match ID and User ID are required" },
        { status: 400 }
      );
    }

    // Get member profile ID
    const profileResult = await executeQuery(
      'SELECT id FROM "MemberProfile" WHERE "userId" = $1',
      [userId]
    );

    if (profileResult.length === 0) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const profileId = profileResult[0].id;

    // Check if already registered
    const existingResult = await executeQuery(
      'SELECT id FROM "Participant" WHERE "matchId" = $1 AND "profileId" = $2',
      [matchId, profileId]
    );

    if (existingResult.length > 0) {
      return NextResponse.json(
        { error: "Already registered for this match" },
        { status: 400 }
      );
    }

    // Add match participation
    const id = uuidv4();
    await executeQuery(
      'INSERT INTO "Participant" (id, "matchId", "profileId") VALUES ($1, $2, $3)',
      [id, matchId, profileId]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return NextResponse.json(
      { error: "Failed to register" },
      { status: 500 }
    );
  }
}
