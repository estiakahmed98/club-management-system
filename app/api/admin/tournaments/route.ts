import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    
    const skip = (page - 1) * limit;
    
    const now = new Date();
    let where: Prisma.TournamentWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
        ],
      }),
    };
    
    // Add status filter
    if (status === "upcoming") {
      where.startDate = { gt: now };
    } else if (status === "ongoing") {
      where = {
        ...where,
        startDate: { lte: now },
        endDate: { gte: now },
      };
    } else if (status === "completed") {
      where.endDate = { lt: now };
    }
    
    const [total, tournaments] = await prisma.$transaction([
      prisma.tournament.count({ where }),
      prisma.tournament.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: "desc" },
        include: {
          positions: true,
        },
      }),
    ]);
    
    return NextResponse.json({
      tournaments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET TOURNAMENTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch tournaments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, startDate, endDate, location, entryFee, totalPrize, description } =
      await req.json();

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Name, start date, and end date are required" },
        { status: 400 }
      );
    }

    const tournament = await prisma.tournament.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location: location || null,
        entryFee: entryFee || 0,
        totalPrize: totalPrize || 0,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, tournament }, { status: 201 });
  } catch (error) {
    console.error("[CREATE TOURNAMENT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create tournament" },
      { status: 500 }
    );
  }
}