import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; positionId: string }> }
) {
  try {
    const { positionId } = await params;
    
    await prisma.tournamentPosition.delete({
      where: { id: positionId },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE POSITION ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete position" },
      { status: 500 }
    );
  }
}