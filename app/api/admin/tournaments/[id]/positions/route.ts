import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const positions = await prisma.tournamentPosition.findMany({
      where: { tournamentId: id },
      orderBy: { position: "asc" },
    });
    
    return NextResponse.json(positions);
  } catch (error) {
    console.error("[GET POSITIONS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { position, teamName, prize } = await req.json();

    if (!teamName) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    const tournamentPosition = await prisma.tournamentPosition.create({
      data: {
        tournamentId: id,
        position,
        teamName,
        prize: prize || 0,
      },
    });

    return NextResponse.json({ success: true, tournamentPosition }, { status: 201 });
  } catch (error) {
    console.error("[CREATE POSITION ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create position" },
      { status: 500 }
    );
  }
}