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

    // Get all matches with participation status
    const matchesResult = await executeQuery(`
      SELECT 
        m.*,
        CASE 
          WHEN p.id IS NOT NULL THEN true
          ELSE false
        END as "isParticipating"
      FROM "Match" m
      LEFT JOIN "Participant" p ON m.id = p."matchId" AND p."profileId" = $1
      ORDER BY m."matchDate" DESC
    `, [profileId]);

    return NextResponse.json(matchesResult);
  } catch (error) {
    console.error("[GET MATCHES ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
