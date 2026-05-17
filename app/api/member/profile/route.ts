//api/member/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

type TeamCategory = "JUNIOR" | "SENIOR" | "GUEST";

function clean(value: unknown) {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : null;
}

function isValidTeamCategory(value: unknown): value is TeamCategory {
  return value === "JUNIOR" || value === "SENIOR" || value === "GUEST";
}

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
      `SELECT 
          mp.id,
          mp."userId",
          mp.name,
          mp.phone,
          mp.email,
          mp."bloodGroup",
          mp."jerseySize",
          mp."jerseyNumber",
          mp.address,
          mp.bio,
          mp."joiningDate",
          mp."imageUrl",
          mp."playsFootball",
          mp."footballPosition",
          mp."playsCricket",
          mp."cricketRole",
          mp.rating,
          mp."teamCategory",
          mp."createdAt",
          mp."updatedAt",
          u.email AS "userEmail"
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
    const body = await req.json();

    const profileId = clean(body.profileId);
    const name = clean(body.name);

    const phone = clean(body.phone);
    const email = clean(body.email);
    const bloodGroup = clean(body.bloodGroup);
    const jerseySize = clean(body.jerseySize);
    const jerseyNumber = clean(body.jerseyNumber);
    const address = clean(body.address);
    const bio = clean(body.bio);
    const imageUrl = clean(body.imageUrl);
    const footballPosition = clean(body.footballPosition);
    const cricketRole = clean(body.cricketRole);

    const playsFootball =
      typeof body.playsFootball === "boolean" ? body.playsFootball : true;

    const playsCricket =
      typeof body.playsCricket === "boolean" ? body.playsCricket : false;

    const ratingRaw = body.rating;
    const rating =
      ratingRaw === undefined || ratingRaw === null || ratingRaw === ""
        ? 0
        : Number(ratingRaw);

    const rawTeamCategory = String(body.teamCategory || "JUNIOR")
      .trim()
      .toUpperCase();

    if (!profileId || !name) {
      return NextResponse.json(
        { error: "Profile ID and name are required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(rating)) {
      return NextResponse.json(
        { error: "Invalid rating" },
        { status: 400 }
      );
    }

    if (!isValidTeamCategory(rawTeamCategory)) {
      return NextResponse.json(
        { error: "Invalid team category" },
        { status: 400 }
      );
    }

    const result = await executeQuery(
      `UPDATE "MemberProfile" 
       SET 
          name = $1,
          phone = $2,
          email = $3,
          "bloodGroup" = $4,
          "jerseySize" = $5,
          "jerseyNumber" = $6,
          address = $7,
          bio = $8,
          "imageUrl" = $9,
          "playsFootball" = $10,
          "footballPosition" = $11,
          "playsCricket" = $12,
          "cricketRole" = $13,
          rating = $14,
          "teamCategory" = $15,
          "updatedAt" = NOW()
       WHERE id = $16
       RETURNING *`,
      [
        name,
        phone,
        email,
        bloodGroup,
        jerseySize,
        jerseyNumber,
        address,
        bio,
        imageUrl,
        playsFootball,
        footballPosition,
        playsCricket,
        cricketRole,
        rating,
        rawTeamCategory,
        profileId,
      ]
    );

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      profile: result[0],
    });
  } catch (error) {
    console.error("[UPDATE PROFILE ERROR]", error);

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}