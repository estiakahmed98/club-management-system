import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { title, imageUrl, description, eventId, matchId, tournamentId } =
      await req.json();

    const relationCount = [eventId, matchId, tournamentId].filter(Boolean).length;
    if (relationCount > 1) {
      return NextResponse.json(
        { error: "Only one of eventId/matchId/tournamentId can be set" },
        { status: 400 },
      );
    }

    const item = await prisma.galleryItem.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title: String(title).trim() } : {}),
        ...(imageUrl !== undefined ? { imageUrl: String(imageUrl).trim() } : {}),
        ...(description !== undefined
          ? { description: description ? String(description).trim() : null }
          : {}),
        ...(eventId !== undefined ? { eventId: eventId || null } : {}),
        ...(matchId !== undefined ? { matchId: matchId || null } : {}),
        ...(tournamentId !== undefined ? { tournamentId: tournamentId || null } : {}),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("[UPDATE ADMIN GALLERY ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE ADMIN GALLERY ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 },
    );
  }
}

