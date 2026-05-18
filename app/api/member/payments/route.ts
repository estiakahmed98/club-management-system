import { NextRequest, NextResponse } from "next/server";
import { prisma, executeQuery } from "@/lib/db";
import { Prisma } from "@prisma/client";

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

export async function POST(req: NextRequest) {
  try {
    const {
      userId,
      amount,
      purpose,
      description,
      eventId,
      matchId,
      tournamentId,
      status,
      month,
      year,
    } = await req.json();

    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Valid amount is required" },
        { status: 400 },
      );
    }

    const relationCount = [eventId, matchId, tournamentId].filter(Boolean).length;
    if (relationCount > 1) {
      return NextResponse.json(
        { error: "Only one of eventId/matchId/tournamentId can be set" },
        { status: 400 },
      );
    }

    const payment = await prisma.payment.create({
      data: {
        userId,
        amount: numericAmount,
        purpose: purpose || "other",
        description: description || null,
        status: status || "paid",
        month: month || null,
        year: year ? Number(year) : null,
        eventId: eventId || null,
        matchId: matchId || null,
        tournamentId: tournamentId || null,
      },
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });
  } catch (error) {
    console.error("[CREATE MEMBER PAYMENT ERROR]", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return NextResponse.json(
          { error: "Invalid reference (member/event/match/tournament not found)" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to create payment" },
      { status: 500 },
    );
  }
}
