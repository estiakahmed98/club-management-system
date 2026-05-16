import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma, TeamCategory } from "@/lib/prisma/client";
import bcrypt from "bcryptjs";

interface UpdateMemberRequestBody {
  name: string;
  email: string;
  phone?: string | null;
  bloodGroup?: string | null;
  jerseySize?: string | null;
  teamCategory?: TeamCategory;
  password?: string;
}

function isValidTeamCategory(value: unknown): value is TeamCategory {
  return value === "JUNIOR" || value === "SENIOR" || value === "GUEST";
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
    const teamCategory = body.teamCategory;
    const password = body.password;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
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
          ...(teamCategory ? { teamCategory } : {}),
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

