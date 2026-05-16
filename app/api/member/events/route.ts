import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
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

    // Get all events with participation status
    const eventsResult = await executeQuery(`
      SELECT 
        e.*,
        CASE 
          WHEN p.id IS NOT NULL THEN true
          ELSE false
        END as "isParticipating"
      FROM "Event" e
      LEFT JOIN "Participant" p ON e.id = p."eventId" AND p."profileId" = $1
      ORDER BY e."eventDate" DESC
    `, [profileId]);

    return NextResponse.json(eventsResult);
  } catch (error) {
    console.error("[GET EVENTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
