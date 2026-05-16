import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { eventId, userId } = await req.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "Event ID and User ID are required" },
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

    // Check if already participating
    const existingResult = await executeQuery(
      'SELECT id FROM "Participant" WHERE "eventId" = $1 AND "profileId" = $2',
      [eventId, profileId]
    );

    if (existingResult.length > 0) {
      return NextResponse.json(
        { error: "Already participating in this event" },
        { status: 400 }
      );
    }

    // Add participation
    const id = uuidv4();
    await executeQuery(
      'INSERT INTO "Participant" (id, "eventId", "profileId") VALUES ($1, $2, $3)',
      [id, eventId, profileId]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[PARTICIPATE ERROR]", error);
    return NextResponse.json(
      { error: "Failed to participate" },
      { status: 500 }
    );
  }
}
