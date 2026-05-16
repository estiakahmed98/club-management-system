import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Count total members (excluding admin users)
    const membersResult = await executeQuery(
      'SELECT COUNT(*) as count FROM "MemberProfile"'
    );
    const totalMembers = parseInt(membersResult[0]?.count || "0");

    // Count total events
    const eventsResult = await executeQuery(
      'SELECT COUNT(*) as count FROM "Event"'
    );
    const totalEvents = parseInt(eventsResult[0]?.count || "0");

    // Count total matches
    const matchesResult = await executeQuery(
      'SELECT COUNT(*) as count FROM "Match"'
    );
    const totalMatches = parseInt(matchesResult[0]?.count || "0");

    // Calculate total income from payments
    const incomeResult = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM "Payment" WHERE status = $1',
      ["paid"]
    );
    const totalIncome = parseFloat(incomeResult[0]?.total || "0");

    // Calculate total expenses
    const expensesResult = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM "Expense"'
    );
    const totalExpenses = parseFloat(expensesResult[0]?.total || "0");

    // Calculate balance
    const totalBalance = totalIncome - totalExpenses;

    return NextResponse.json({
      totalMembers,
      totalEvents,
      totalMatches,
      totalIncome,
      totalExpenses,
      totalBalance,
    });
  } catch (error) {
    console.error("[STATS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
