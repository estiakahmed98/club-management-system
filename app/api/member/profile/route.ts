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

    const result = await executeQuery(
      `SELECT mp.id, mp.name, mp.phone, mp."bloodGroup", mp."jerseySize", mp.address, mp."joiningDate", u.email
       FROM "MemberProfile" mp
       JOIN "User" u ON mp."userId" = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("[GET PROFILE ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { profileId, name, phone, bloodGroup, jerseySize, address } =
      await req.json();

    if (!profileId || !name) {
      return NextResponse.json(
        { error: "Profile ID and name are required" },
        { status: 400 }
      );
    }

    await executeQuery(
      `UPDATE "MemberProfile" 
       SET name = $1, phone = $2, "bloodGroup" = $3, "jerseySize" = $4, address = $5, "updatedAt" = NOW()
       WHERE id = $6`,
      [name, phone || null, bloodGroup || null, jerseySize || null, address || null, profileId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPDATE PROFILE ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
