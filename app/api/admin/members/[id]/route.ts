import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TeamCategory } from "@/lib/prisma/client";

interface UpdateMemberRequestBody {
  name?: string;
  phone?: string | null;
  bloodGroup?: string | null;
  jerseySize?: string | null;
  teamCategory?: TeamCategory;
}

function isValidTeamCategory(value: string | undefined): value is TeamCategory {
  return value === "JUNIOR" || value === "SENIOR" || value === "GUEST";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await req.json()) as UpdateMemberRequestBody;

    const name = body.name?.trim();
    const phone = body.phone?.trim() || null;
    const bloodGroup = body.bloodGroup?.trim() || null;
    const jerseySize = body.jerseySize?.trim() || null;
    const teamCategory = body.teamCategory;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (teamCategory && !isValidTeamCategory(teamCategory)) {
      return NextResponse.json(
        { error: "Invalid team category" },
        { status: 400 },
      );
    }

    const updatedProfile = await prisma.memberProfile.update({
      where: { id },
      data: {
        name,
        phone,
        bloodGroup,
        jerseySize,
        ...(teamCategory ? { teamCategory } : {}),
      },
    });

    return NextResponse.json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("[UPDATE MEMBER ERROR]", error);

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
    const { id } = await params;
    const profile = await prisma.memberProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.memberProfile.delete({
        where: { id },
      });

      await tx.user.delete({
        where: { id: profile.userId },
      });
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