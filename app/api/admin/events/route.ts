import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const result = await executeQuery(
      'SELECT * FROM "Event" ORDER BY "eventDate" DESC'
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET EVENTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, eventDate, location, type, budget } =
      await req.json();

    if (!name || !eventDate) {
      return NextResponse.json(
        { error: "Name and date are required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    await executeQuery(
      'INSERT INTO "Event" (id, name, description, "eventDate", location, type, budget) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [id, name, description || null, eventDate, location || null, type, budget || 0]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[CREATE EVENT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, name, description, eventDate, location, type, budget } =
      await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
        { status: 400 }
      );
    }

    await executeQuery(
      'UPDATE "Event" SET name = $1, description = $2, "eventDate" = $3, location = $4, type = $5, budget = $6, "updatedAt" = NOW() WHERE id = $7',
      [name, description || null, eventDate, location || null, type, budget || 0, id]
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
