import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const { eventId, userId } = await req.json();

    if (!eventId || !userId) {
      return NextResponse.json(
        { error: "Event ID and User ID are required" },
        { status: 400 }
      );
    }

    const profile = await prisma.memberProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!profile) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    await prisma.participant.create({
      data: {
        profileId: profile.id,
        eventId,
        status: "joined",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Already participating in this event" },
          { status: 400 },
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Event not found" },
          { status: 404 },
        );
      }
    }

    console.error("[PARTICIPATE ERROR]", error);
    return NextResponse.json(
      { error: "Failed to participate" },
      { status: 500 }
    );
  }
}
