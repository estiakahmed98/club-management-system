import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const match = await prisma.match.findUnique({
      where: { id },
    });
    
    if (!match) {
      return NextResponse.json(
        { error: "Match not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(match);
  } catch (error) {
    console.error("[GET MATCH ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch match" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, opponent, matchDate, location, matchType, result, score } =
      await req.json();

    if (!name || !opponent) {
      return NextResponse.json(
        { error: "Name and opponent are required" },
        { status: 400 }
      );
    }

    const match = await prisma.match.update({
      where: { id },
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

    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error("[UPDATE MATCH ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update match" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.match.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE MATCH ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete match" },
      { status: 500 }
    );
  }
}