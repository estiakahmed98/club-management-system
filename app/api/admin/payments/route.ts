import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  try {
    const result = await executeQuery(`
      SELECT 
        p.id,
        p.amount,
        p.purpose,
        p.description,
        p.status,
        p."paymentDate",
        mp.name,
        u.email
      FROM "Payment" p
      JOIN "User" u ON p."userId" = u.id
      JOIN "MemberProfile" mp ON u.id = mp."userId"
      ORDER BY p."paymentDate" DESC
    `);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[GET PAYMENTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, amount, purpose, description, status } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "User ID and amount are required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    await executeQuery(
      'INSERT INTO "Payment" (id, "userId", amount, purpose, description, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, userId, amount, purpose || "other", description || null, status || "paid"]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[CREATE PAYMENT ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 }
    );
  }
}
