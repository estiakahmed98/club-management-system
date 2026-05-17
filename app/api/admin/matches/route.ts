import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const search = searchParams.get("search") || "";
    const matchType = searchParams.get("matchType") || "";
    const result = searchParams.get("result") || "";
    
    const skip = (page - 1) * limit;
    
    const where: Prisma.MatchWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { opponent: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(matchType && { matchType }),
      ...(result && { result }),
    };
    
    const [total, matches] = await prisma.$transaction([
      prisma.match.count({ where }),
      prisma.match.findMany({
        where,
        skip,
        take: limit,
        orderBy: { matchDate: "desc" },
      }),
    ]);
    
    return NextResponse.json({
      matches,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET MATCHES ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      name,
      opponent,
      matchDate,
      location,
      matchType,
      result,
      score,
      homeTeamCategory,
      awayTeamCategory,
      autoAddParticipants,
    } = await req.json();

    if (!name || !opponent || !matchDate) {
      return NextResponse.json(
        { error: "Name, opponent, and date are required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.create({
      data: {
        name,
        opponent,
        matchDate: new Date(matchDate),
        location: location || null,
        matchType,
        result: result || null,
        score: score || null,
      },
    });

    if (matchType === "senior_junior" && autoAddParticipants) {
      const categories = [homeTeamCategory, awayTeamCategory].filter(Boolean);

      const profiles = await prisma.memberProfile.findMany({
        where: {
          teamCategory: {
            in: categories.length ? categories : ["SENIOR", "JUNIOR"],
          },
        },
        select: { id: true },
      });

      if (profiles.length) {
        await prisma.participant.createMany({
          data: profiles.map((p) => ({
            profileId: p.id,
            matchId: match.id,
            status: "joined",
          })),
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json({ success: true, match }, { status: 201 });
  } catch (error) {
    console.error("[CREATE MATCH ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create match" },
      { status: 500 }
    );
  }
}
