import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { name, phone, bloodGroup, jerseySize } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updatedProfile = await prisma.memberProfile.update({
      where: { id: params.id },
      data: {
        name,
        phone: phone || null,
        bloodGroup: bloodGroup || null,
        jerseySize: jerseySize || null,
        updatedAt: new Date(),
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
  { params }: { params: { id: string } },
) {
  try {
    // Get profile to find user ID
    const profile = await prisma.memberProfile.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Delete in transaction
    await prisma.$transaction(async (tx) => {
      await tx.memberProfile.delete({
        where: { id: params.id },
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
