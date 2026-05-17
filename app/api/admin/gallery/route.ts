import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const search = (searchParams.get("search") || "").trim();

    const eventId = searchParams.get("eventId") || undefined;
    const matchId = searchParams.get("matchId") || undefined;
    const tournamentId = searchParams.get("tournamentId") || undefined;

    const skip = (page - 1) * limit;

    const where: Prisma.GalleryItemWhereInput = {
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(eventId ? { eventId } : {}),
      ...(matchId ? { matchId } : {}),
      ...(tournamentId ? { tournamentId } : {}),
    };

    const [total, items] = await prisma.$transaction([
      prisma.galleryItem.count({ where }),
      prisma.galleryItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET ADMIN GALLERY ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, imageUrl, description, eventId, matchId, tournamentId } =
      await req.json();

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and imageUrl are required" },
        { status: 400 },
      );
    }

    const relationCount = [eventId, matchId, tournamentId].filter(Boolean).length;
    if (relationCount > 1) {
      return NextResponse.json(
        { error: "Only one of eventId/matchId/tournamentId can be set" },
        { status: 400 },
      );
    }

    const item = await prisma.galleryItem.create({
      data: {
        title: String(title).trim(),
        imageUrl: String(imageUrl).trim(),
        description: description ? String(description).trim() : null,
        eventId: eventId || null,
        matchId: matchId || null,
        tournamentId: tournamentId || null,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("[CREATE ADMIN GALLERY ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 },
    );
  }
}

