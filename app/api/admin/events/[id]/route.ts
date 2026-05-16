import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await executeQuery('DELETE FROM "Event" WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE EVENT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, description, eventDate, location, type, budget } =
      await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    await executeQuery(
      'UPDATE "Event" SET name = $1, description = $2, "eventDate" = $3, location = $4, type = $5, budget = $6, "updatedAt" = NOW() WHERE id = $7',
      [name, description || null, eventDate, location || null, type, budget || 0, params.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPDATE EVENT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}
