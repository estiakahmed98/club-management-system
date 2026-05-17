import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { Prisma, TeamCategory } from "@/lib/prisma/client";

function isValidTeamCategory(value: unknown): value is TeamCategory {
  return value === "JUNIOR" || value === "SENIOR" || value === "GUEST";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
      name?: string;
      phone?: string | null;
      bloodGroup?: string | null;
      jerseySize?: string | null;
      jerseyNumber?: string | null;
      address?: string | null;
      bio?: string | null;
      teamCategory?: TeamCategory;
      playsFootball?: boolean;
      footballPosition?: string | null;
      playsCricket?: boolean;
      cricketRole?: string | null;
      rating?: number | string | null;
      imageUrl?: string | null;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const name = body.name?.trim();
    const phone = body.phone?.trim() || null;
    const bloodGroup = body.bloodGroup?.trim() || null;
    const jerseySize = body.jerseySize?.trim() || null;
    const jerseyNumber = body.jerseyNumber?.trim() || null;
    const address = body.address?.trim() || null;
    const bio = body.bio?.trim() || null;
    const teamCategory = body.teamCategory || "JUNIOR";
    const playsFootball = body.playsFootball ?? true;
    const footballPosition = body.footballPosition?.trim() || null;
    const playsCricket = body.playsCricket ?? false;
    const cricketRole = body.cricketRole?.trim() || null;
    const ratingRaw = body.rating;
    const rating =
      ratingRaw === undefined || ratingRaw === null || ratingRaw === ""
        ? 0
        : Number(ratingRaw);
    const imageUrl = body.imageUrl?.trim() || null;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    if (!isValidTeamCategory(teamCategory)) {
      return NextResponse.json(
        { error: "Invalid team category" },
        { status: 400 },
      );
    }

    // Hash password
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
            teamCategory,
            playsFootball,
            footballPosition,
            playsCricket,
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
        user: {
          id: created.id,
          email: created.email,
          role: created.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SIGNUP ERROR]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
