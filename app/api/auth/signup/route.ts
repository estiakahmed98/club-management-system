import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { Prisma, TeamCategory } from "@/lib/prisma/client";

function isValidTeamCategory(value: unknown): value is TeamCategory {
  return value === "JUNIOR" || value === "SENIOR" || value === "GUEST";
}

function clean(value: unknown) {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("[SIGNUP BODY]", body);

    const email = clean(body.email)?.toLowerCase();
    const password =
      typeof body.password === "string" ? body.password : null;

    const name = clean(body.name);
    const phone = clean(body.phone);
    const bloodGroup = clean(body.bloodGroup);
    const jerseySize = clean(body.jerseySize);
    const jerseyNumber = clean(body.jerseyNumber);
    const address = clean(body.address);
    const bio = clean(body.bio);
    const footballPosition = clean(body.footballPosition);
    const cricketRole = clean(body.cricketRole);
    const imageUrl = clean(body.imageUrl);

    const rawTeamCategory = String(body.teamCategory || "JUNIOR")
      .trim()
      .toUpperCase();

    const ratingRaw = body.rating;
    const rating =
      ratingRaw === undefined || ratingRaw === null || ratingRaw === ""
        ? 0
        : Number(ratingRaw);

    const playsFootball = body.playsFootball ?? true;
    const playsCricket = body.playsCricket ?? false;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
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

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const created = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "member",
        profile: {
          create: {
            name: name || email.split("@")[0],
            email,
            phone,
            bloodGroup,
            jerseySize,
            jerseyNumber,
            address,
            bio,
            teamCategory: rawTeamCategory,
            playsFootball: Boolean(playsFootball),
            footballPosition,
            playsCricket: Boolean(playsCricket),
            cricketRole,
            rating,
            imageUrl,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP ERROR]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}