import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET() {
  try {
    const members = await executeQuery(`
      SELECT
        id,
        "userId",
        name,
        email,
        phone,
        "bloodGroup",
        "jerseySize",
        "jerseyNumber",
        address,
        bio,
        "teamCategory",
        "joiningDate",
        "playsFootball",
        "footballPosition",
        "playsCricket",
        "cricketRole",
        rating,
        "imageUrl"
      FROM "MemberProfile"
      ORDER BY "joiningDate" DESC
    `);

    return NextResponse.json({
      success: true,
      total: members.length,
      members,
    });
  } catch (error) {
    console.error("[GET PUBLIC MEMBERS ERROR]", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}