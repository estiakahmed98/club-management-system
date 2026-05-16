import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await executeQuery('DELETE FROM "Payment" WHERE id = $1', [params.id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE PAYMENT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to delete payment" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { amount, purpose, description, status } = await req.json();

    if (!amount) {
      return NextResponse.json(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    await executeQuery(
      'UPDATE "Payment" SET amount = $1, purpose = $2, description = $3, status = $4, "updatedAt" = NOW() WHERE id = $5',
      [amount, purpose, description || null, status, params.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[UPDATE PAYMENT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
