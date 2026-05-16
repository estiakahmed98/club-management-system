import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    // Get total members
    const membersResult = await executeQuery(
      'SELECT COUNT(*) as count FROM "MemberProfile"'
    );
    const totalMembers = parseInt(membersResult[0]?.count || "0");

    // Get total income
    const incomeResult = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM "Payment" WHERE status = $1',
      ["paid"]
    );
    const totalIncome = parseFloat(incomeResult[0]?.total || "0");

    // Get total expenses
    const expensesResult = await executeQuery(
      'SELECT COALESCE(SUM(amount), 0) as total FROM "Expense"'
    );
    const totalExpenses = parseFloat(expensesResult[0]?.total || "0");

    // Get total events and matches
    const eventsResult = await executeQuery(
      'SELECT COUNT(*) as count FROM "Event"'
    );
    const totalEvents = parseInt(eventsResult[0]?.count || "0");

    const matchesResult = await executeQuery(
      'SELECT COUNT(*) as count FROM "Match"'
    );
    const totalMatches = parseInt(matchesResult[0]?.count || "0");

    // Get member payments (top contributors)
    const memberPaymentsResult = await executeQuery(`
      SELECT 
        mp.name,
        COALESCE(SUM(p.amount), 0) as amount
      FROM "MemberProfile" mp
      LEFT JOIN "User" u ON mp."userId" = u.id
      LEFT JOIN "Payment" p ON u.id = p."userId" AND p.status = 'paid'
      GROUP BY mp.name
      ORDER BY amount DESC
    `);

    // Get monthly income
    const monthlyIncomeResult = await executeQuery(`
      SELECT 
        TO_CHAR("paymentDate", 'YYYY-MM') as month,
        COALESCE(SUM(amount), 0) as income
      FROM "Payment"
      WHERE status = 'paid'
      GROUP BY TO_CHAR("paymentDate", 'YYYY-MM')
      ORDER BY month DESC
      LIMIT 12
    `);

    // Get expenses by category
    const expensesByCategoryResult = await executeQuery(`
      SELECT 
        category,
        COALESCE(SUM(amount), 0) as amount
      FROM "Expense"
      GROUP BY category
      ORDER BY amount DESC
    `);

    const balance = totalIncome - totalExpenses;

    return NextResponse.json({
      totalMembers,
      totalIncome,
      totalExpenses,
      balance,
      totalEvents,
      totalMatches,
      memberPayments: memberPaymentsResult,
      monthlyIncome: monthlyIncomeResult.reverse(),
      expensesByCategory: expensesByCategoryResult,
    });
  } catch (error) {
    console.error("[REPORTS ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch report data" },
      { status: 500 }
    );
  }
}
