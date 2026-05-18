import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma, TeamCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

interface UpdateMemberRequestBody {
  name: string;
  email: string;
  phone?: string | null;
  bloodGroup?: string | null;
  jerseySize?: string | null;
  jerseyNumber?: string | null;
  address?: string | null;
  bio?: string | null;
  teamCategory?: TeamCategory;
  password?: string;
  playsFootball?: boolean;
  footballPosition?: string | null;
  playsCricket?: boolean;
  cricketRole?: string | null;
  rating?: number | string | null;
  imageUrl?: string | null;
}

function isValidTeamCategory(value: unknown): value is TeamCategory {
  return value === "JUNIOR" || value === "SENIOR" || value === "GUEST";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // MemberProfile.id

    const member = await prisma.memberProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: member.id,
      userId: member.userId,
      name: member.name,
      email: member.email || member.user.email,
      phone: member.phone,
      bloodGroup: member.bloodGroup,
      jerseySize: member.jerseySize,
      jerseyNumber: member.jerseyNumber,
      address: member.address,
      bio: member.bio,
      teamCategory: member.teamCategory,
      joiningDate: member.joiningDate,
      playsFootball: member.playsFootball,
      footballPosition: member.footballPosition,
      playsCricket: member.playsCricket,
      cricketRole: member.cricketRole,
      rating: member.rating,
      imageUrl: member.imageUrl,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    });
  } catch (error) {
    console.error("[GET MEMBER ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch member" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // MemberProfile.id
    const body = (await req.json()) as UpdateMemberRequestBody;

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim() || null;
    const bloodGroup = body.bloodGroup?.trim() || null;
    const jerseySize = body.jerseySize?.trim() || null;
    const jerseyNumber = body.jerseyNumber?.trim() || null;
    const address = body.address?.trim() || null;
    const bio = body.bio?.trim() || null;
    const teamCategory = body.teamCategory;
    const password = body.password;
    const playsFootball = body.playsFootball;
    const footballPosition = body.footballPosition?.trim() || null;
    const playsCricket = body.playsCricket;
    const cricketRole = body.cricketRole?.trim() || null;
    const ratingRaw = body.rating;
    const rating =
      ratingRaw === undefined
        ? undefined
        : ratingRaw === null || ratingRaw === ""
          ? 0
          : Number(ratingRaw);
    const imageUrl = body.imageUrl?.trim() || null;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    if (rating !== undefined && !Number.isFinite(rating)) {
      return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
    }

    if (teamCategory && !isValidTeamCategory(teamCategory)) {
      return NextResponse.json(
        { error: "Invalid team category" },
        { status: 400 },
      );
    }

    const existingProfile = await prisma.memberProfile.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: existingProfile.userId },
        data: {
          email,
          ...(hashedPassword ? { password: hashedPassword } : {}),
        },
      });

      const profile = await tx.memberProfile.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          bloodGroup,
          jerseySize,
          jerseyNumber,
          address,
          bio,
          ...(teamCategory ? { teamCategory } : {}),
          ...(playsFootball !== undefined ? { playsFootball } : {}),
          ...(footballPosition !== undefined ? { footballPosition } : {}),
          ...(playsCricket !== undefined ? { playsCricket } : {}),
          ...(cricketRole !== undefined ? { cricketRole } : {}),
          ...(rating !== undefined ? { rating } : {}),
          ...(imageUrl !== undefined ? { imageUrl } : {}),
        },
      });

      return { user, profile };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("[UPDATE MEMBER ERROR]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to update member" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // MemberProfile.id

    const existingProfile = await prisma.memberProfile.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Deleting the user cascades to MemberProfile via relation onDelete: Cascade.
    await prisma.user.delete({
      where: { id: existingProfile.userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE MEMBER ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 },
    );
  }
}
