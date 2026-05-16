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

    // Get member profile info
    const profileResult = await executeQuery(
      `SELECT mp.name, u.email FROM "MemberProfile" mp
       JOIN "User" u ON mp."userId" = u.id WHERE u.id = $1`,
      [userId]
    );

    if (profileResult.length === 0) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      );
    }

    const { name: memberName, email } = profileResult[0];

    // Get total payments (sum of all paid payments)
    const paymentsResult = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM "Payment" WHERE "userId" = $1 AND status = $2',
      [userId, "paid"]
    );
    const totalPayments = parseFloat(paymentsResult[0]?.total || "0");

    // Get count of participated events
    const eventsResult = await executeQuery(
      `SELECT COUNT(DISTINCT "eventId") as count FROM "Participant" 
       WHERE "profileId" = (SELECT id FROM "MemberProfile" WHERE "userId" = $1)`,
      [userId]
    );
    const totalEvents = parseInt(eventsResult[0]?.count || "0");

    // Get count of participated matches
    const matchesResult = await executeQuery(
      `SELECT COUNT(DISTINCT "matchId") as count FROM "Participant" 
       WHERE "profileId" = (SELECT id FROM "MemberProfile" WHERE "userId" = $1)`,
      [userId]
    );
    const totalMatches = parseInt(matchesResult[0]?.count || "0");

    // Get recent payments
    const recentPaymentsResult = await executeQuery(
      `SELECT id, amount, purpose, "paymentDate" FROM "Payment" 
       WHERE "userId" = $1 
       ORDER BY "paymentDate" DESC 
       LIMIT 10`,
      [userId]
    );

    return NextResponse.json({
      memberName,
      email,
      totalPayments,
      totalEvents,
      totalMatches,
      recentPayments: recentPaymentsResult,
    });
  } catch (error) {
    console.error("[MEMBER STATS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
