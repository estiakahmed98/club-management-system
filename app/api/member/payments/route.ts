import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all payments for user
    const paymentsResult = await executeQuery(
      `SELECT id, amount, purpose, description, status, "paymentDate" 
       FROM "Payment" 
       WHERE "userId" = $1 
       ORDER BY "paymentDate" DESC`,
      [userId]
    );

    // Calculate totals
    const paidTotal = paymentsResult
      .filter((p: any) => p.status === "paid")
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    const pendingTotal = paymentsResult
      .filter((p: any) => p.status === "pending")
      .reduce((sum: number, p: any) => sum + p.amount, 0);

    return NextResponse.json({
      payments: paymentsResult,
      totalPaid: paidTotal,
      totalPending: pendingTotal,
    });
  } catch (error) {
    console.error("[GET PAYMENTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
